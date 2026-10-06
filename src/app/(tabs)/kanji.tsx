import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SakuraIcon } from '../../components/icons';
import { Furigana, H1, HintButton } from '../../components/ui';
import { WritingPad } from '../../components/WritingPad';
import { deck } from '../../data/deck';
import { formatInterval, Rating, schedule, useApp } from '../../lib/store';
import { colors, fonts } from '../../theme';

const RATINGS: { r: Rating; label: string; bg: string; fg: string; border?: string }[] = [
  { r: 'again', label: 'もう一度', bg: colors.sumi, fg: colors.shiro },
  { r: 'hard', label: '難しい', bg: colors.shiro, fg: colors.beni, border: colors.beni },
  { r: 'good', label: '良い', bg: colors.sakura, fg: colors.sumi },
  { r: 'easy', label: '簡単', bg: colors.beni, fg: colors.shiro },
];

export default function Kanji() {
  const app = useApp();
  const [revealed, setRevealed] = useState(false);
  const [doneThisSession, setDone] = useState(0);

  // Cards due now (new cards have no state and are always due).
  const queue = useMemo(() => {
    const now = Date.now();
    return deck.filter((c) => (app.srs[c.id]?.due ?? 0) <= now);
  }, [app.srs]);
  const card = queue[0];
  const total = queue.length + doneThisSession;

  function rate(r: Rating) {
    if (!card) return;
    app.review(card.id, r);
    setDone((n) => n + (r === 'again' ? 0 : 1));
    setRevealed(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <H1 style={{ flex: 1, fontSize: 22 }}>漢字・語彙の復習</H1>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.muted }}>{`${doneThisSession} / ${total}`}</Text>
          <HintButton on={app.hints} onPress={app.toggleHints} />
        </View>
        <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: doneThisSession }}>
          <View style={[styles.fill, { width: total ? `${(doneThisSession / total) * 100}%` : '100%' }]} />
        </View>

        {!card ? (
          <View style={[styles.card, { alignItems: 'center', gap: 12, paddingVertical: 40 }]}>
            <SakuraIcon size={72} />
            <Text style={{ fontFamily: fonts.mincho, fontSize: 22, color: colors.sumi }}>今日の復習は完了！</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.muted }}>また明日がんばろう。</Text>
            {app.hints && <Text style={styles.hint}>英 · All reviews done for today. See you tomorrow!</Text>}
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.chip}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: colors.beni }}>{`${app.level} · 語彙`}</Text>
                </View>
                {!app.srs[card.id] && <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: colors.muted }}>新しい</Text>}
              </View>
              {revealed && <Text style={styles.reading}>{card.reading}</Text>}
              <Text style={styles.word}>{card.word}</Text>
              {app.hints && <Text style={styles.hint}>{`英 · ${card.en}`}</Text>}
              {revealed ? (
                <View style={styles.example}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: colors.muted }}>例文</Text>
                  <Furigana text={card.example} size={16} />
                  {app.hints && <Text style={[styles.hint, { fontFamily: fonts.medium }]}>{card.exampleEn}</Text>}
                </View>
              ) : (
                <Pressable onPress={() => setRevealed(true)} style={styles.revealBtn} accessibilityRole="button">
                  <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.shiro }}>答えを見る</Text>
                </Pressable>
              )}
            </View>

            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.sumi }}>書いてみよう</Text>
            <WritingPad key={card.id} model={card.word[0]} />

            {revealed && (
              <View style={{ flexDirection: 'row', gap: 8 }} accessibilityLabel="自己評価">
                {RATINGS.map(({ r, label, bg, fg, border }) => (
                  <Pressable
                    key={r}
                    onPress={() => rate(r)}
                    accessibilityRole="button"
                    style={[styles.rateBtn, { backgroundColor: bg, borderWidth: border ? 1.5 : 0, borderColor: border }]}
                  >
                    <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: fg }}>{label}</Text>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: fg }}>
                      {formatInterval(schedule(app.srs[card.id], r).due - Date.now())}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingTop: 12, gap: 14 },
  track: { height: 6, backgroundColor: colors.sakuraLine, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.beni, borderRadius: 999 },
  card: { backgroundColor: colors.shiro, borderWidth: 1, borderColor: colors.sakuraLine, borderRadius: 24, padding: 20, alignItems: 'center', gap: 10 },
  chip: { backgroundColor: colors.sakuraLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  reading: { fontFamily: fonts.medium, fontSize: 20, color: colors.beni, letterSpacing: 2 },
  word: { fontFamily: fonts.mincho, fontSize: 80, lineHeight: 96, color: colors.sumi },
  hint: { fontFamily: fonts.bold, fontSize: 13, color: colors.beni },
  example: { alignSelf: 'stretch', borderTopWidth: 1, borderTopColor: colors.sakura, borderStyle: 'dashed', paddingTop: 12, gap: 6 },
  revealBtn: { marginTop: 8, minHeight: 46, paddingHorizontal: 28, borderRadius: 999, backgroundColor: colors.sumi, alignItems: 'center', justifyContent: 'center' },
  rateBtn: { flex: 1, minHeight: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 2 },
});
