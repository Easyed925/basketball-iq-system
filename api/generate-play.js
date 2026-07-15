// Vercel serverless function. Runs server-side only — the API key never
// reaches the browser. Deployed automatically because it lives in /api
// at the project root; no extra Vercel configuration is needed.

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

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Claude sometimes adds a sentence before/after the JSON despite
    // instructions not to. Fall back to grabbing the outermost {...}
    // block instead of giving up.
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw e;
  }
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

  const prompt = (req.body && req.body.prompt) || '';
  if (!prompt.trim()) {
    res.status(400).json({ error: 'Describe the play you want first.' });
    return;
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    res.status(400).json({ error: `Keep the description under ${MAX_PROMPT_LENGTH} characters.` });
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
        max_tokens: 2000,
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
      res.status(502).json({ error: 'No text response from Claude.' });
      return;
    }

    let play;
    try {
      play = extractJson(textBlock.text);
    } catch (e) {
      res.status(502).json({ error: 'Claude\u2019s response wasn\u2019t valid play data. Try rephrasing your request.' });
      return;
    }

    if (!isValidPlay(play)) {
      res.status(502).json({ error: 'Claude\u2019s response was missing required play data. Try rephrasing your request.' });
      return;
    }

    res.status(200).json(play);
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong generating the play. Please try again.' });
  }
};
