import { Link, router } from 'expo-router';
import { ComponentType } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, G, Pattern, Rect } from 'react-native-svg';
import { GrammarIcon, KanjiIcon, ListenIcon, ReadIcon, TalkIcon, VocabIcon } from '../../components/icons';
import { Furigana, H1, H2, Hint, HintButton } from '../../components/ui';
import { topicForToday } from '../../data/topics';
import { dayKey, streak, useApp } from '../../lib/store';
import { colors, fonts } from '../../theme';

type Mode = { ja: string; en: string; Icon: ComponentType<{ size?: number }>; href?: '/chat' | '/kanji' };
const MODES: Mode[] = [
  { ja: '会話', en: 'Conversation', Icon: TalkIcon, href: '/chat' },
  { ja: '漢字', en: 'Kanji', Icon: KanjiIcon, href: '/kanji' },
  { ja: '語彙', en: 'Vocabulary', Icon: VocabIcon, href: '/kanji' },
  { ja: '聴解', en: 'Listening', Icon: ListenIcon },
  { ja: '文法', en: 'Grammar', Icon: GrammarIcon },
  { ja: '読解', en: 'Reading', Icon: ReadIcon },
];

function greeting() {
  const h = new Date().getHours();
  return h < 11 ? 'おはよう' : h < 18 ? 'こんにちは' : 'こんばんは';
}

function Seigaiha() {
  const rings = [11, 7, 3];
  return (
    <Svg width={220} height={120} style={{ position: 'absolute', right: -10, bottom: -6 }} pointerEvents="none">
      <Defs>
        <Pattern id="sg" width={24} height={12} patternUnits="userSpaceOnUse">
          <G fill={colors.beni} stroke={colors.shiro} strokeOpacity={0.22} strokeWidth={1}>
            {[[0, 12], [24, 12], [12, 18]].map(([cx, cy]) => rings.map((r) => <Circle key={`${cx}-${r}`} cx={cx} cy={cy} r={r} />))}
          </G>
        </Pattern>
      </Defs>
      <Rect width={220} height={120} fill="url(#sg)" />
    </Svg>
  );
}

export default function Home() {
  const app = useApp();
  const topic = topicForToday();
  const today = app.days[dayKey()];
  const learned = Object.values(app.srs).filter((c) => c.reps > 0).length;
  const now = new Date();
  const wd = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <View style={{ gap: 2, flex: 1 }}>
            <Text style={styles.date}>{`${now.getMonth() + 1}月${now.getDate()}日（${wd}）`}</Text>
            <H1>{`${greeting()}、${app.name}さん`}</H1>
          </View>
          <HintButton on={app.hints} onPress={app.toggleHints} />
        </View>

        <View style={styles.stats}>
          {[
            { label: '連続', value: String(streak(app.days)), unit: '日', accent: true },
            { label: '今日', value: String(today ? today.chat + today.reviews : 0), unit: '回' },
            { label: '単語', value: String(learned), unit: '語' },
          ].map((s, i) => (
            <View key={s.label} style={[styles.stat, i < 2 && styles.statDivider]}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={[styles.statValue, s.accent && { color: colors.beni }]}>
                {s.value}
                <Text style={{ fontSize: 13 }}> {s.unit}</Text>
              </Text>
            </View>
          ))}
        </View>
        <Hint show={app.hints} style={{ marginTop: -8 }}>英 · Streak · Today’s practice · Words learned</Hint>

        <View style={styles.hero}>
          <Seigaiha />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.avatar}>
              <Text style={{ fontFamily: fonts.mincho, fontSize: 18, color: colors.beni }}>桜</Text>
            </View>
            <View>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.shiro, opacity: 0.9 }}>今日の会話レッスン</Text>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.shiro }}>{`さくら先生 · ${app.level}`}</Text>
            </View>
          </View>
          <Furigana text={topic.title} size={22} color={colors.shiro} />
          {app.hints && (
            <View style={styles.heroHint}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: colors.beni }}>{`英 · ${topic.en}`}</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.shiro }}>{`約10分 · ${topic.grammar}`}</Text>
            <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/chat', params: { topic: topic.id } })} style={styles.startBtn}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.beni }}>始める</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <H2>練習メニュー</H2>
          <Hint show={app.hints}>英 · Practice menu</Hint>
        </View>
        <View style={styles.grid}>
          {MODES.map(({ ja, en, Icon, href }) => {
            const body = (
              <>
                <Icon size={40} />
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.sumi }}>{ja}</Text>
                {!href && <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.muted }}>準備中</Text>}
                <Hint show={app.hints} style={{ fontSize: 11 }}>{en}</Hint>
              </>
            );
            return href ? (
              <Link key={ja} href={href} asChild>
                <Pressable style={styles.tile} accessibilityRole="link">{body}</Pressable>
              </Link>
            ) : (
              <View key={ja} style={[styles.tile, { opacity: 0.75 }]} accessibilityState={{ disabled: true }}>
                {body}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingTop: 12, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  date: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  stats: { flexDirection: 'row', backgroundColor: colors.shiro, borderRadius: 18, borderWidth: 1, borderColor: colors.sakuraLine, paddingVertical: 14 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { borderRightWidth: 1, borderRightColor: colors.sakuraLine },
  statLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  statValue: { fontFamily: fonts.mincho, fontSize: 22, color: colors.sumi },
  hero: { backgroundColor: colors.beni, borderRadius: 22, padding: 20, gap: 12, overflow: 'hidden' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.shiro, alignItems: 'center', justifyContent: 'center' },
  heroHint: { alignSelf: 'flex-start', backgroundColor: colors.shiro, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  startBtn: { minHeight: 44, paddingHorizontal: 22, backgroundColor: colors.shiro, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    flexBasis: '30%',
    flexGrow: 1,
    minHeight: 104,
    backgroundColor: colors.shiro,
    borderWidth: 1,
    borderColor: colors.sakuraLine,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
  },
});
