// Vercel serverless function. Lets a signed-in coach cancel (or undo
// canceling) their own subscription. Cancellation is scheduled for the
// end of the current period rather than immediate, so a coach who
// cancels during their trial keeps access through the trial they were
// already promised and is simply never charged when it ends.

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
  if (!stripeSecretKey) {
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

  const action = req.body && req.body.action;
  if (action !== 'cancel' && action !== 'resume') {
    res.status(400).json({ error: 'Invalid action.' });
    return;
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('stripe_subscription_id')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || !profile.stripe_subscription_id) {
    res.status(400).json({ error: 'No subscription found on your account.' });
    return;
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const subscription = await stripe.subscriptions.update(profile.stripe_subscription_id, {
      cancel_at_period_end: action === 'cancel',
    });

    await supabaseAdmin
      .from('profiles')
      .update({ cancel_at_period_end: Boolean(subscription.cancel_at_period_end) })
      .eq('id', user.id);

    res.status(200).json({ cancel_at_period_end: Boolean(subscription.cancel_at_period_end) });
  } catch (e) {
    res.status(500).json({ error: 'Couldn\u2019t update your subscription right now. Please try again.' });
  }
};
