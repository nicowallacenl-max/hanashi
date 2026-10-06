# 話 Hanashi

A personal Japanese practice app for an intermediate learner (~2.5 years, JLPT N3).
The app is all Japanese. English shows up only behind the **英** marker, as a hint.

- **ホーム**: streak, today's practice, the daily conversation topic, and the practice menu
- **会話**: chat with さくら先生 (AI tutor), with furigana, corrections (添削), suggested replies and Japanese text-to-speech
- **漢字・語彙**: spaced-repetition flashcards plus a writing pad with a 田 guide
- **記録**: streak, last 7 days of practice, and totals
- **設定**: name, JLPT level, tutor status, and a reset option

Built with Expo (SDK 57) and Expo Router, in TypeScript. The design comes from the 話 Hanashi canvas: beni red `#B3242C`, sakura `#F4C3CC`, sumi `#1E1A18` and white.

## Run it

```bash
npm install
npx expo start          # scan the QR code with Expo Go on your phone
```

Without a tutor server, さくら先生 runs in **offline mode** and gives scripted replies.

## Turn on the Claude tutor

The phone never holds your API key. A small server in `server/` (no dependencies) calls the Claude API for it.

```bash
# terminal 1: the tutor server
ANTHROPIC_API_KEY=sk-ant-... npm run server     # listens on :8787

# terminal 2: the app, pointed at your computer's LAN IP
EXPO_PUBLIC_TUTOR_URL=http://192.168.1.20:8787 npx expo start
```

You can also put `EXPO_PUBLIC_TUTOR_URL` in `.env.local` (see `.env.example`).
The server uses Claude Sonnet 5.5 (`claude-sonnet-5-5`) by default. Override with `ANTHROPIC_MODEL`, and set `ANTHROPIC_EFFORT` (`low` by default, or `medium`/`high`) to trade speed for depth.

To use the tutor away from home, deploy `server/index.mjs` to any Node 18+ host and point `EXPO_PUBLIC_TUTOR_URL` at it.

## Project layout

```
src/app/            routes (Expo Router)
  (tabs)/           ホーム · 会話 · 漢字 · 記録 · 設定
src/components/     icons (hi-fi + tab), Furigana, 英 HintButton, WritingPad
src/data/           N3 starter deck, daily conversation topics
src/lib/store.tsx   persisted state (AsyncStorage), SRS scheduler, streak
src/lib/tutor.ts    tutor client and offline fallback
src/theme.ts        colours and fonts
server/index.mjs    Claude proxy (structured JSON output)
```

## Furigana notation

Japanese text uses `漢字{かんじ}`: the reading in braces attaches to the run of kanji just before it.
`<Furigana text="今週末{こんしゅうまつ}は…" />` renders it. The tutor server asks Claude to reply in the same notation.
