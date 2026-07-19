// Vercel serverless function. Decides access for a signed-in coach by
// checking, in order: the admin allowlist (an env var, never exposed to
// the browser), the "comped" flag in the database, then real
// subscription status. This is the single source of truth for access —
// the frontend never decides this on its own.

const { createClient } = require('@supabase/supabase-js');

function getSupabaseAdmin() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST.' });
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
    res.status(401).json({ error: 'Please sign in.' });
    return;
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData || !userData.user) {
    res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    return;
  }
  const user = userData.user;

  // 1. Admin allowlist — controlled entirely by an env var, never
  // visible in the app's code or the browser.
  if (getAdminEmails().includes((user.email || '').toLowerCase())) {
    res.status(200).json({ access: true, reason: 'admin' });
    return;
  }

  // 2. Comped / subscribed — read from the database.
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('is_comped, subscription_status')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    res.status(500).json({ error: 'Couldn\u2019t check your account status right now.' });
    return;
  }

  if (profile && profile.is_comped) {
    res.status(200).json({ access: true, reason: 'comped' });
    return;
  }

  if (profile && profile.subscription_status === 'active') {
    res.status(200).json({ access: true, reason: 'subscribed' });
    return;
  }

  res.status(200).json({ access: false, reason: 'no_subscription' });
};
