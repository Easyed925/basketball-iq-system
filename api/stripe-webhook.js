// Vercel serverless function. Receives billing events directly from
// Stripe (not from the browser) and updates each coach's subscription
// status in the database. Signature verification requires the exact
// raw request bytes, so body parsing is disabled below and the body is
// read manually — this is the standard, well-established pattern for
// Stripe webhooks on Vercel's Node.js runtime.

const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

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
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecretKey || !webhookSecret) {
    res.status(500).json({ error: 'Server is not configured with Stripe credentials yet.' });
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    res.status(500).json({ error: 'Server is not configured with Supabase credentials yet.' });
    return;
  }

  const stripe = new Stripe(stripeSecretKey);
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (e) {
    res.status(400).json({ error: `Webhook signature verification failed: ${e.message}` });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata && session.metadata.supabase_user_id;
        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({ subscription_status: 'active', stripe_customer_id: session.customer })
            .eq('id', userId);
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata && subscription.metadata.supabase_user_id;
        const statusMap = { active: 'active', trialing: 'active', past_due: 'past_due', canceled: 'canceled', unpaid: 'past_due' };
        const newStatus = statusMap[subscription.status] || 'inactive';

        if (userId) {
          await supabaseAdmin.from('profiles').update({ subscription_status: newStatus }).eq('id', userId);
        } else {
          // Fallback: match by Stripe customer id if metadata wasn't set
          // on this particular event.
          await supabaseAdmin
            .from('profiles')
            .update({ subscription_status: newStatus })
            .eq('stripe_customer_id', subscription.customer);
        }
        break;
      }
      default:
        break; // Other event types aren't relevant to access control.
    }
    res.status(200).json({ received: true });
  } catch (e) {
    // Returning a non-2xx tells Stripe to retry the event later, which
    // is the correct behavior if our own database update failed.
    res.status(500).json({ error: 'Webhook handler failed.' });
  }
};
