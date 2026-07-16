// Vercel serverless function. Runs server-side only — the API key never
// reaches the browser. Deployed automatically because it lives in /api
// at the project root; no extra Vercel configuration is needed.

const { createClient } = require('@supabase/supabase-js');

const SYSTEM_PROMPT = `You are an elite basketball coach and play designer. A coach will describe what they need in plain language (for example: "give me a play to beat a 2-3 zone" or "backdoor cut for a slow big").

Respond with ONLY the JSON object below. Do not include any greeting, explanation, caveat, or sentence before or after it. Do not wrap it in markdown code fences. Your entire response must start with { and end with }, matching exactly this shape:
{
  "name": "string",
  "description": "one sentence description",
  "roster": [{ "id": "o1", "team": "offense", "label": "1" }, ...],
  "steps": [
    {
      "positions": { "o1": { "x": 0-100, "y": 0-50 }, ... },
      "ball": { "x": 0-100, "y": 0-50 },
      "arrows": [{ "id": "a1", "x1": 0, "y1": 0, "x2": 0, "y2": 0, "type": "cut" | "pass" | "screen" }]
    }
  ]
}

Coordinate system: the court is 100 units wide by 50 units tall. The offensive basket is near x=8, y=25 (left side). Half court is x=50. Keep all player and ball coordinates within 0-100 and 0-50. Use 3-5 offense players (ids o1-o5) and, if the play is against a specific defense, 3-5 defense players (ids d1-d5). Produce 2-4 steps showing the full sequence. Every arrow belongs to the step it starts from and represents the movement that happens between that step and the next one.`;

const MAX_PROMPT_LENGTH = 400;
const PER_USER_LIMIT = 15; // generations per signed-in coach per hour
const GLOBAL_LIMIT = 150; // generations across all coaches per hour, as a cost ceiling

function getSupabaseAdmin() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  // Service role key bypasses Row Level Security entirely — this client
  // must never be created with, or exposed to, the browser.
  return createClient(url, serviceKey);
}

async function checkAndRecordUsage(supabaseAdmin, userId, prompt) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count: userCount, error: userCountError } = await supabaseAdmin
    .from('ai_generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneHourAgo);
  if (userCountError) throw userCountError;
  if (userCount >= PER_USER_LIMIT) return 'user';

  const { count: globalCount, error: globalCountError } = await supabaseAdmin
    .from('ai_generations')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneHourAgo);
  if (globalCountError) throw globalCountError;
  if (globalCount >= GLOBAL_LIMIT) return 'global';

  const { error: insertError } = await supabaseAdmin.from('ai_generations').insert({ user_id: userId, prompt: prompt.slice(0, 400) });
  if (insertError) throw insertError;

  return null;
}

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();

  const attempts = [];
  attempts.push(cleaned);

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    attempts.push(cleaned.slice(start, end + 1));
  }

  // LLMs frequently leave a trailing comma before a closing } or ] —
  // valid-looking JSON that strict JSON.parse rejects. Try a repaired
  // version of each candidate too.
  const repaired = attempts.map((a) => a.replace(/,\s*([}\]])/g, '$1'));
  attempts.push(...repaired);

  let lastError;
  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

function isValidPlay(play) {
  if (!play || typeof play !== 'object') return false;
  if (!Array.isArray(play.roster) || play.roster.length === 0) return false;
  if (!Array.isArray(play.steps) || play.steps.length === 0) return false;
  return play.steps.every((step) => step && typeof step === 'object' && step.positions && step.ball);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST.' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is not configured with an Anthropic API key yet.' });
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
    res.status(401).json({ error: 'Please sign in to use the AI play assistant.' });
    return;
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData || !userData.user) {
    res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    return;
  }
  const userId = userData.user.id;

  const prompt = (req.body && req.body.prompt) || '';
  if (!prompt.trim()) {
    res.status(400).json({ error: 'Describe the play you want first.' });
    return;
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    res.status(400).json({ error: `Keep the description under ${MAX_PROMPT_LENGTH} characters.` });
    return;
  }

  let limited;
  try {
    limited = await checkAndRecordUsage(supabaseAdmin, userId, prompt);
  } catch (e) {
    res.status(500).json({ error: 'Couldn\u2019t check your usage limit right now. Please try again.' });
    return;
  }
  if (limited === 'user') {
    res.status(429).json({ error: 'You\u2019ve hit your hourly limit for AI-generated plays. Try again in a bit, or design the play manually on the whiteboard.' });
    return;
  }
  if (limited === 'global') {
    res.status(429).json({ error: 'The AI play assistant is getting a lot of use right now. Please try again shortly.' });
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: `Claude API error (${response.status}): ${errText.slice(0, 200)}` });
      return;
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((b) => b.type === 'text');
    if (!textBlock) {
      const blockTypes = (data.content || []).map((b) => b.type).join(', ') || 'none';
      res.status(502).json({
        error: `No text response from Claude (stop reason: ${data.stop_reason || 'unknown'}, content blocks: [${blockTypes}]). Try again or rephrase.`,
      });
      return;
    }

    let play;
    try {
      play = extractJson(textBlock.text);
    } catch (e) {
      res.status(502).json({
        error: `Claude\u2019s response wasn\u2019t valid play data. Try rephrasing your request. (Raw start: ${textBlock.text.slice(0, 500)})`,
      });
      return;
    }

    if (!isValidPlay(play)) {
      res.status(502).json({
        error: `Claude\u2019s response was missing required play data. Try rephrasing your request. (Raw start: ${textBlock.text.slice(0, 500)})`,
      });
      return;
    }

    res.status(200).json(play);
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong generating the play. Please try again.' });
  }
};
