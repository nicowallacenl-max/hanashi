# CLAUDE.md: 話 Hanashi

Read `AGENTS.md` first for the Expo rules: SDK 57, routes in `src/app/`, use `npx expo install`, and run typecheck before you finish.

## Product rules (don't break these)

- **The UI is Japanese-only.** English may appear only as a hint behind the 英 marker (`HintButton` and `Hint` in `src/components/ui.tsx`, or the global `hints` toggle in `useApp()`). Never add English labels that are always visible.
- The learner is intermediate (~2.5 years, around JLPT N3). Pitch content at the level chosen in settings (`useApp().level`).
- Write Japanese with furigana as `漢字{かんじ}` and render it with `<Furigana>`. Don't put raw ruby HTML in it.

## Design system

- Colours live in `src/theme.ts`: beni `#B3242C` (primary), sakura `#F4C3CC`/`#FBE7EA`, sumi `#1E1A18`, white, and washi background `#FDF6F7`. Don't add new hues.
- Fonts: Shippori Mincho for headings (`fonts.mincho`) and Zen Kaku Gothic New for body text.
- Icons are in `src/components/icons.tsx`, ported from the design canvas. Hi-fi icons use a 64 grid in two tones plus sumi line work; tab icons use a 24 grid with 1.9 strokes.
- Touch targets must be at least 44px. Every Pressable needs an `accessibilityRole` and, for icon-only buttons, a Japanese `accessibilityLabel`.

## Architecture

- State: `src/lib/store.tsx`, a React context persisted to AsyncStorage under `hanashi:v1`. If you change the shape, bump the key or migrate the data.
- SRS: `schedule()` in the store is a simplified SM-2.
- Tutor: `src/lib/tutor.ts` sends a POST to `${EXPO_PUBLIC_TUTOR_URL}/chat`. When that variable isn't set, it falls back to the offline script.
- Server: `server/index.mjs` has no dependencies. It uses structured outputs (`output_config.format` with a JSON schema) so replies come back as `{ ja, en, correction?, suggestions }`. The default model is `claude-sonnet-5-5`, which rejects forced `tool_choice`, so don't switch back to forced tool use. The API key stays on the server.

## Checks

```bash
npx tsc --noEmit
npx expo export --platform web   # catches bundling errors
```

## Roadmap (next things to build)

1. Voice input on 会話 (speech-to-text in ja-JP; needs a development build, not Expo Go)
2. 聴解 listening: tutor-generated short dialogues read with expo-speech, plus comprehension questions
3. 文法 grammar drills generated from the day's target grammar
4. 読解 graded reading passages with tap-to-look-up words
5. Save words from chat into the SRS deck (お気に入り / sakura icon)
6. Track study minutes, not just counts, on the 記録 screen
