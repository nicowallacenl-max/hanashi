import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '../theme';

/**
 * Renders Japanese with furigana. Notation: 漢字{かんじ} — the reading in braces
 * attaches to the run of kanji immediately before it. e.g. "今週末{こんしゅうまつ}は"
 */
const RUBY = /([々一-鿿]+)\{([^}]+)\}/g;

export function stripFurigana(s: string) {
  return s.replace(RUBY, '$1');
}

export function Furigana({ text, size = 16, color = colors.sumi, style }: { text: string; size?: number; color?: string; style?: ViewStyle }) {
  const tokens: { base: string; rt?: string; tail?: string }[] = [];
  let last = 0;
  for (const m of text.matchAll(RUBY)) {
    for (const ch of text.slice(last, m.index)) tokens.push({ base: ch });
    tokens.push({ base: m[1], rt: m[2] });
    last = (m.index ?? 0) + m[0].length;
  }
  for (const ch of text.slice(last)) tokens.push({ base: ch });
  // Kinsoku: closing punctuation never starts a line — glue it to the previous token.
  for (let i = tokens.length - 1; i > 0; i--) {
    if (!tokens[i].rt && /^[、。！？!?」』）)ー…]$/.test(tokens[i].base)) {
      tokens[i - 1] = { ...tokens[i - 1], tail: (tokens[i].base) + (tokens[i - 1].tail ?? '') } as typeof tokens[number];
      tokens.splice(i, 1);
    }
  }
  const hasRuby = tokens.some((t) => t.rt);
  const rtSize = Math.round(size * 0.55);

  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' }, style]} accessible accessibilityLabel={stripFurigana(text)}>
      {tokens.map((t, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <View style={{ alignItems: 'center' }}>
            {hasRuby && (
              <Text style={{ fontSize: rtSize, lineHeight: rtSize + 3, color: colors.muted, fontFamily: fonts.medium }}>{t.rt ?? ' '}</Text>
            )}
            <Text style={{ fontSize: size, lineHeight: size * 1.45, color, fontFamily: fonts.regular }}>{t.base}</Text>
          </View>
          {t.tail ? <Text style={{ fontSize: size, lineHeight: size * 1.45, color, fontFamily: fonts.regular }}>{t.tail}</Text> : null}
        </View>
      ))}
    </View>
  );
}

/** The 英 marker — the only way English appears in the app. */
export function HintButton({ on, onPress, size = 'md' }: { on: boolean; onPress: () => void; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 28 : 44;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={on ? '英語ヒントを隠す' : '英語ヒントを表示'}
      accessibilityState={{ selected: on }}
      hitSlop={size === 'sm' ? 8 : 0}
      style={{
        width: dim,
        height: dim,
        borderRadius: size === 'sm' ? 7 : 12,
        borderWidth: 1.5,
        borderColor: colors.beni,
        backgroundColor: on ? colors.beni : colors.shiro,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontFamily: fonts.mincho, fontSize: size === 'sm' ? 13 : 18, color: on ? colors.shiro : colors.beni }}>英</Text>
    </Pressable>
  );
}

export function Hint({ children, show, style }: { children: ReactNode; show: boolean; style?: TextStyle }) {
  if (!show) return null;
  return <Text style={[styles.hint, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle | ViewStyle[] }) {
  return <View style={[styles.card, style as ViewStyle]}>{children}</View>;
}

export const H1 = ({ children, style }: { children: ReactNode; style?: TextStyle }) => (
  <Text style={[{ fontFamily: fonts.mincho, fontSize: 26, color: colors.sumi }, style]}>{children}</Text>
);
export const H2 = ({ children, style }: { children: ReactNode; style?: TextStyle }) => (
  <Text style={[{ fontFamily: fonts.mincho, fontSize: 18, color: colors.sumi }, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  hint: { fontFamily: fonts.bold, fontSize: 12, color: colors.beni },
  card: { backgroundColor: colors.shiro, borderRadius: 20, borderWidth: 1, borderColor: colors.sakuraLine, padding: 16 },
});
