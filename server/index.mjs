// さくら先生 tutor server — a tiny proxy between the app and the Claude API.
// Keeps your Anthropic API key off the phone. Zero dependencies (Node 18+).
//
//   ANTHROPIC_API_KEY=sk-ant-... node server/index.mjs
//
// Env: ANTHROPIC_API_KEY (required), ANTHROPIC_MODEL (optional), PORT (default 8787)
import http from 'node:http';

const PORT = Number(process.env.PORT ?? 8787);
const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5';
const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) {
  console.error('Missing ANTHROPIC_API_KEY');
  process.exit(1);
}

const system = ({ level, name, topic, grammar }) => `You are さくら先生, a warm, encouraging Japanese conversation tutor.
The learner, ${name}, has studied Japanese for about 2.5 years and is working at JLPT ${level}.
Today's topic: "${topic}". Target grammar to weave in naturally: ${grammar}.

Rules:
- Speak ONLY Japanese in "ja". Keep replies short (1–3 sentences) and end with a question that keeps the conversation going.
- Use vocabulary and grammar appropriate to ${level}; occasionally stretch one step higher.
- Add furigana to kanji a ${level} learner may not know, using the notation 漢字{かんじ} — the reading in braces directly after the kanji run. Don't add furigana to very common kanji.
- English is ONLY a hint: put a natural English translation of your reply in "en".
- If the learner's LAST message has a grammar, particle, conjugation or word-choice mistake, fill "correction" with the smallest wrong fragment, the corrected fragment, a short explanation in simple Japanese (with furigana notation), and a one-line English hint. If it was correct or only a stylistic nit, omit "correction".
- "suggestions": 2 short example replies the learner could give, in Japanese, at their level.
Always respond by calling the "reply" tool.`;

const tool = {
  name: 'reply',
  description: "さくら先生's next turn in the conversation.",
  input_schema: {
    type: 'object',
    properties: {
      ja: { type: 'string', description: 'Reply in Japanese with 漢字{かんじ} furigana notation' },
      en: { type: 'string', description: 'English translation hint of the reply' },
      correction: {
        type: 'object',
        properties: {
          wrong: { type: 'string' },
          right: { type: 'string' },
          explanation: { type: 'string', description: 'Simple Japanese, furigana notation allowed' },
          en: { type: 'string', description: 'One-line English hint' },
        },
        required: ['wrong', 'right', 'explanation', 'en'],
      },
      suggestions: { type: 'array', items: { type: 'string' }, maxItems: 3 },
    },
    required: ['ja', 'en', 'suggestions'],
  },
};

async function callClaude(body) {
  const messages = (body.messages ?? [])
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-30);
  // The API requires the first message to be from the user.
  while (messages.length && messages[0].role !== 'user') messages.shift();

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      system: system({
        level: body.level ?? 'N3',
        name: String(body.name ?? 'ニコ').slice(0, 40),
        topic: String(body.topic ?? 'everyday life').slice(0, 200),
        grammar: String(body.grammar ?? '').slice(0, 100),
      }),
      tools: [tool],
      tool_choice: { type: 'tool', name: 'reply' },
      messages,
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const block = data.content?.find((b) => b.type === 'tool_use');
  if (!block) throw new Error('No tool_use block in response');
  return { suggestions: [], ...block.input };
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

http
  .createServer(async (req, res) => {
    if (req.method === 'OPTIONS') return res.writeHead(204, cors).end();
    if (req.method === 'GET' && req.url === '/health') return res.writeHead(200, cors).end('ok');
    if (req.method !== 'POST' || req.url !== '/chat') return res.writeHead(404, cors).end();
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 200_000) return res.writeHead(413, cors).end();
    }
    try {
      const out = await callClaude(JSON.parse(raw));
      res.writeHead(200, { ...cors, 'content-type': 'application/json' }).end(JSON.stringify(out));
    } catch (e) {
      console.error(e);
      res.writeHead(502, { ...cors, 'content-type': 'application/json' }).end(JSON.stringify({ error: 'tutor_failed' }));
    }
  })
  .listen(PORT, '0.0.0.0', () => console.log(`さくら先生 listening on http://0.0.0.0:${PORT} (model ${MODEL})`));
