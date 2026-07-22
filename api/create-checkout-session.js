// Vercel serverless function. Creates a Stripe Checkout session for the
// signed-in coach and hands back the URL to redirect them to. Stripe
// hosts the actual payment form — no card details ever touch this app.

const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

function getSupabaseAdmin() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST.' });
    return;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!stripeSecretKey || !priceId) {
    res.status(500).json({ error: 'Server is not configured with Stripe credentials yet.' });
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    res.status(500).json({ error: 'Server is not configured with Supabase credentials yet.' });
    return;
  }

  const authHeader = req.headers && req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Please sign in first.' });
    return;
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData || !userData.user) {
    res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    return;
  }
  const user = userData.user;
  const stripe = new Stripe(stripeSecretKey);

  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    let customerId = profile && profile.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabaseAdmin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    const origin = (req.headers && req.headers.origin) || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=canceled`,
      metadata: { supabase_user_id: user.id },
      subscription_data: { trial_period_days: 14, metadata: { supabase_user_id: user.id } },
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: 'Couldn\u2019t start checkout right now. Please try again.' });
  }
};
