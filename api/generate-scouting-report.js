// Vercel serverless function. Runs server-side only — the API key never
// reaches the browser. Deployed automatically because it lives in /api
// at the project root; no extra Vercel configuration is needed.
//
// Sibling to generate-play.js and generate-practice-plan.js — same auth,
// rate-limiting, and JSON-repair pattern, applied to opponent scouting
// reports. Shares the same ai_generations usage limit as the other two,
// tagged with type: 'scouting_report' so usage can be broken down later
// if needed.

const { createClient } = require('@supabase/supabase-js');

const SYSTEM_PROMPT = `You are an elite basketball coach who writes opponent scouting reports. A coach will describe what they know about an upcoming opponent in plain language (for example: "next team runs a lot of ball screens for their point guard, presses full court after makes, has a dominant post player who struggles from the free throw line").

Respond with ONLY the JSON object below. Do not include any greeting, explanation, caveat, or sentence before or after it. Do not wrap it in markdown code fences. Your entire response must start with { and end with }, matching exactly this shape:
{
  "opponentName": "string, the opponent's name if given, otherwise a short descriptive label like 'Upcoming Opponent'",
  "offensiveTendencies": "string, 2-4 sentences on pick and roll frequency, shooting range, pace preferences",
  "defensiveSystem": "string, 2-4 sentences on man-to-man or zone, pressure level, rebounding strength",
  "keyPlayers": "string, 2-4 sentences on star player strengths, weaknesses, foul trouble patterns",
  "matchupAdvantages": "string, 2-4 sentences on exploitable weaknesses and personnel mismatches",
  "gamePlan": "string, 2-4 sentences on offensive strategy and defensive adjustments to use in the game"
}

Tailor every section specifically to the details the coach described rather than generic scouting language. If the coach did not mention something relevant to a section, make a reasonable, clearly-labeled assumption rather than leaving it vague.`;

const MAX_PROMPT_LENGTH = 600;
const PER_USER_LIMIT = 15; // generations per signed-in coach per hour — shared with AI play/practice plan generation
const GLOBAL_LIMIT = 150; // generations across all coaches per hour, as a cost ceiling — shared with AI play/practice plan generation

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

  // Counts are NOT filtered by type — scouting report, practice plan, and
  // play generations share one limit per coach and one global limit.
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

  const { error: insertError } = await supabaseAdmin
    .from('ai_generations')
    .insert({ user_id: userId, prompt: prompt.slice(0, 400), type: 'scouting_report' });
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

function isValidScoutingReport(report) {
  if (!report || typeof report !== 'object') return false;
  if (typeof report.opponentName !== 'string' || !report.opponentName.trim()) return false;
  const sections = ['offensiveTendencies', 'defensiveSystem', 'keyPlayers', 'matchupAdvantages', 'gamePlan'];
  return sections.every((key) => typeof report[key] === 'string' && report[key].trim());
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
    res.status(401).json({ error: 'Please sign in to use the AI scouting report assistant.' });
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
    res.status(400).json({ error: 'Describe what you know about the opponent first.' });
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
    res.status(500).json({ error: "Couldn't check your usage limit right now. Please try again." });
    return;
  }
  if (limited === 'user') {
    res.status(429).json({ error: "You've hit your hourly AI generation limit. Try again in a bit, or build the report manually." });
    return;
  }
  if (limited === 'global') {
    res.status(429).json({ error: 'The AI assistant is getting a lot of use right now. Please try again shortly.' });
    return;
  }

  try {
    const callClaude = async (extraInstruction) => {
      const systemPrompt = extraInstruction ? `${SYSTEM_PROMPT}\n\n${extraInstruction}` : SYSTEM_PROMPT;
      return fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-5',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
    };

    let response = await callClaude();

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: `Claude API error (${response.status}): ${errText.slice(0, 200)}` });
      return;
    }

    let data = await response.json();
    let textBlock = (data.content || []).find((b) => b.type === 'text');
    if (!textBlock) {
      const blockTypes = (data.content || []).map((b) => b.type).join(', ') || 'none';
      res.status(502).json({
        error: `No text response from Claude (stop reason: ${data.stop_reason || 'unknown'}, content blocks: [${blockTypes}]). Try again or rephrase.`,
      });
      return;
    }

    let report;
    let parseError;
    try {
      report = extractJson(textBlock.text);
    } catch (e) {
      parseError = e;
    }

    // First attempt produced invalid JSON — most likely an unescaped
    // quote inside a string value, or a response cut short. Retry once
    // with a firmer instruction before giving up.
    if (parseError || !isValidScoutingReport(report)) {
      const retryInstruction = 'CRITICAL: Your previous response was not valid, complete JSON. Escape every double-quote character inside string values as \\". Do not truncate — every object and array must be fully closed. Return ONLY the complete JSON object, nothing else.';
      response = await callClaude(retryInstruction);

      if (!response.ok) {
        const errText = await response.text();
        res.status(502).json({ error: `Claude API error on retry (${response.status}): ${errText.slice(0, 200)}` });
        return;
      }

      data = await response.json();
      textBlock = (data.content || []).find((b) => b.type === 'text');
      if (!textBlock) {
        res.status(502).json({
          error: `No text response from Claude on retry (stop reason: ${data.stop_reason || 'unknown'}). Try again or rephrase.`,
        });
        return;
      }

      try {
        report = extractJson(textBlock.text);
      } catch (e) {
        res.status(502).json({
          error: `Claude's response wasn't valid scouting report data, even after a retry (stop reason: ${data.stop_reason || 'unknown'}). Try rephrasing your request. (Raw start: ${textBlock.text.slice(0, 500)})`,
        });
        return;
      }

      if (!isValidScoutingReport(report)) {
        res.status(502).json({
          error: `Claude's response was missing required scouting report data, even after a retry (stop reason: ${data.stop_reason || 'unknown'}). Try rephrasing your request. (Raw start: ${textBlock.text.slice(0, 500)})`,
        });
        return;
      }
    }

    res.status(200).json(report);
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong generating the scouting report. Please try again.' });
  }
};
