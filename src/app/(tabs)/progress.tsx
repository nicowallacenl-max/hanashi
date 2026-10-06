import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FujiIcon } from '../../components/icons';
import { Card, H1, H2, Hint, HintButton } from '../../components/ui';
import { deck } from '../../data/deck';
import { lastNDays, Level, streak, useApp } from '../../lib/store';
import { colors, fonts } from '../../theme';

const LEVELS: Level[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export default function Progress() {
  const app = useApp();
  const week = lastNDays(app.days);
  const max = Math.max(1, ...week.map((d) => d.total));
  const weekTotal = week.reduce((s, d) => s + d.total, 0);
  const allDays = Object.values(app.days);
  const totalChat = allDays.reduce((s, d) => s + d.chat, 0);
  const totalReviews = allDays.reduce((s, d) => s + d.reviews, 0);
  const learned = Object.values(app.srs).filter((c) => c.reps > 0).length;
  const deckPct = Math.round((learned / deck.length) * 100);
  const current = LEVELS.indexOf(app.level);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <H1>学習記録</H1>
            <Hint show={app.hints}>英 · Study record</Hint>
          </View>
          <HintButton on={app.hints} onPress={app.toggleHints} />
        </View>

        <View style={styles.dark}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <FujiIcon size={44} inverted />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.shiro, opacity: 0.8 }}>JLPT 目標</Text>
              <Text style={{ fontFamily: fonts.mincho, fontSize: 20, color: colors.shiro }}>{`${app.level} を目指して`}</Text>
              <Hint show={app.hints} style={{ color: colors.sakura }}>{`英 · Working towards ${app.level}`}</Hint>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.shiro, opacity: 0.8 }}>連続</Text>
              <Text style={{ fontFamily: fonts.mincho, fontSize: 26, color: colors.sakura }}>{`${streak(app.days)}日`}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {LEVELS.slice(0, 4).map((l, i) => (
              <View key={l} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                <View style={[styles.seg, { backgroundColor: i < current ? colors.beni : i === current ? colors.sakura : colors.sumiSoft }]} />
                <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: i === current ? colors.sakura : colors.shiro, opacity: i > current ? 0.75 : 1 }}>
                  {i < current ? `${l} ✓` : i === current ? `${l} 今` : l}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <H2 style={{ fontSize: 17 }}>この7日間</H2>
            <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.muted }}>
              合計 <Text style={{ fontFamily: fonts.bold, color: colors.sumi }}>{`${weekTotal}回`}</Text>
            </Text>
          </View>
          <Hint show={app.hints}>英 · Last 7 days · practice count</Hint>
          <View style={{ flexDirection: 'row', gap: 10, height: 120, alignItems: 'flex-end' }} accessibilityLabel="毎日の練習回数">
            {week.map((d) => (
              <View key={d.key} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                <Text style={{ fontFamily: d.isToday ? fonts.bold : fonts.regular, fontSize: 11, color: d.isToday ? colors.beni : colors.muted }}>{d.total}</Text>
                <View style={{ width: '100%', height: Math.max(4, (d.total / max) * 90), backgroundColor: d.isToday ? colors.beni : colors.sakura, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderRadius: 2 }} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {week.map((d) => (
              <Text key={d.key} style={{ flex: 1, textAlign: 'center', fontSize: 12, fontFamily: d.isToday ? fonts.bold : fonts.regular, color: d.isToday ? colors.beni : colors.muted }}>
                {d.weekday}
              </Text>
            ))}
          </View>
        </Card>

        <Card style={{ gap: 12 }}>
          <H2 style={{ fontSize: 17 }}>合計</H2>
          {[
            { k: '会話', en: 'Messages sent', v: `${totalChat}回` },
            { k: '復習', en: 'Card reviews', v: `${totalReviews}回` },
            { k: '習得語彙', en: 'Words learned', v: `${learned} / ${deck.length}`, pct: deckPct },
          ].map((row) => (
            <View key={row.k} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.sumi }}>
                  {row.k}
                  {app.hints ? <Text style={{ color: colors.beni, fontSize: 12 }}>{`  ${row.en}`}</Text> : null}
                </Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.muted }}>{row.v}</Text>
              </View>
              {row.pct !== undefined && (
                <View style={{ height: 8, backgroundColor: colors.sakuraLight, borderRadius: 999 }}>
                  <View style={{ width: `${row.pct}%`, height: '100%', backgroundColor: colors.beni, borderRadius: 999 }} />
                </View>
              )}
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingTop: 12, gap: 14 },
  dark: { backgroundColor: colors.sumi, borderRadius: 22, padding: 18, gap: 14 },
  seg: { width: '100%', height: 6, borderRadius: 999 },
});
