// さくら先生 — the AI tutor client.
// If EXPO_PUBLIC_TUTOR_URL is set, replies come from the Claude-backed server in /server.
// Otherwise a small scripted tutor runs locally so the app works offline.
import type { Level } from './store';
import type { Topic } from '../data/topics';

export type Correction = { wrong: string; right: string; explanation: string; en: string };
export type TutorTurn = {
  ja: string; // reply in Japanese with furigana notation 漢字{かんじ}
  en: string; // English hint (hidden behind 英)
  correction?: Correction; // feedback on the learner's last message
  suggestions: string[]; // short possible replies, Japanese only
};
export type ChatMessage = { role: 'user' | 'assistant'; content: string };

const URL = process.env.EXPO_PUBLIC_TUTOR_URL;
export const tutorMode: 'claude' | 'offline' = URL ? 'claude' : 'offline';

export async function askTutor(opts: { history: ChatMessage[]; topic: Topic; level: Level; name: string }): Promise<TutorTurn> {
  if (!URL) return mockTutor(opts.history);
  const res = await fetch(`${URL.replace(/\/$/, '')}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: opts.history, topic: opts.topic.en, grammar: opts.topic.grammar, level: opts.level, name: opts.name }),
  });
  if (!res.ok) throw new Error(`Tutor server error ${res.status}`);
  return (await res.json()) as TutorTurn;
}

// ---------- Offline scripted tutor ----------
// Topic-neutral follow-ups so the offline tutor fits any daily topic.
const FOLLOW_UPS: TutorTurn[] = [
  { ja: 'いいですね！もう少{すこ}し詳{くわ}しく教{おし}えてください。', en: 'Nice! Tell me a little more about it.', suggestions: ['実{じつ}は…', 'えっと、例{たと}えば…'] },
  { ja: 'なるほど。それはいつから始{はじ}めましたか？', en: 'I see. When did that start?', suggestions: ['去年{きょねん}からです', '子供{こども}の時{とき}からです'] },
  { ja: 'どうしてそれが好{す}きなんですか？', en: 'Why do you like it?', suggestions: ['楽{たの}しいからです', 'リラックスできるからです'] },
  { ja: '楽{たの}しそうですね！今日{きょう}はよく話{はな}せました。また明日{あした}話{はな}しましょう。', en: "Sounds fun! You spoke well today. Let's talk again tomorrow.", suggestions: ['ありがとうございました！'] },
];

function mockCorrection(text: string): Correction | undefined {
  if (/いいだったら|いいだら/.test(text))
    return { wrong: 'いいだったら', right: 'よかったら', explanation: 'い形容詞{けいようし}の「たら」形{けい}は「～かったら」になります。いい → よかったら', en: 'i-adjectives take ～かったら in the conditional. いい is irregular: よかったら.' };
  if (/行くつもりだです|するつもりだです/.test(text))
    return { wrong: 'つもりだです', right: 'つもりです', explanation: '「だ」と「です」は一緒{いっしょ}に使{つか}いません。', en: "Don't use だ and です together." };
  return undefined;
}

async function mockTutor(history: ChatMessage[]): Promise<TutorTurn> {
  await new Promise((r) => setTimeout(r, 700));
  const userTurns = history.filter((m) => m.role === 'user');
  const last = userTurns[userTurns.length - 1]?.content ?? '';
  const turn = FOLLOW_UPS[Math.min(userTurns.length - 1, FOLLOW_UPS.length - 1)];
  return { ...turn, correction: mockCorrection(last) };
}
