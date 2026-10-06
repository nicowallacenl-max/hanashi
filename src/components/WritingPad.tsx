// Finger/mouse writing pad with a 田 guide and a faint model character.
import { useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '../theme';

const SIZE = 120;

export function WritingPad({ model }: { model: string }) {
  const [strokes, setStrokes] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const cur = useRef('');
  const [showModel, setShowModel] = useState(true);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        cur.current = `M${x.toFixed(1)} ${y.toFixed(1)}`;
        setCurrent(cur.current);
      },
      onPanResponderMove: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        cur.current += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
        setCurrent(cur.current);
      },
      onPanResponderRelease: () => {
        const done = cur.current;
        setStrokes((s) => [...s, done]);
        cur.current = '';
        setCurrent('');
      },
    }),
  ).current;

  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-end' }}>
      <View style={styles.pad} {...pan.panHandlers} accessibilityLabel="書く練習の枠">
        <View style={styles.vGuide} pointerEvents="none" />
        <View style={styles.hGuide} pointerEvents="none" />
        {showModel && (
          <Text style={styles.model} pointerEvents="none" selectable={false}>
            {model}
          </Text>
        )}
        <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill} pointerEvents="none">
          {[...strokes, current].filter(Boolean).map((d, i) => (
            <Path key={i} d={d} stroke={colors.sumi} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          ))}
        </Svg>
      </View>
      <View style={{ flex: 1, gap: 8 }}>
        <Pressable onPress={() => setShowModel((v) => !v)} style={styles.btnOutline} accessibilityRole="button">
          <Text style={styles.btnText}>{showModel ? 'お手本を隠す' : 'お手本を見る'}</Text>
        </Pressable>
        <Pressable onPress={() => setStrokes((s) => s.slice(0, -1))} style={styles.btnSoft} accessibilityRole="button">
          <Text style={styles.btnText}>一画戻す</Text>
        </Pressable>
        <Pressable onPress={() => setStrokes([])} style={styles.btnSoft} accessibilityRole="button">
          <Text style={styles.btnText}>消す</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { userSelect: 'none', width: SIZE, height: SIZE, backgroundColor: colors.shiro, borderWidth: 1.5, borderColor: colors.sumi, borderRadius: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  vGuide: { position: 'absolute', left: SIZE / 2, top: 0, bottom: 0, borderLeftWidth: 1, borderStyle: 'dashed', borderColor: '#D9C9CC' },
  hGuide: { position: 'absolute', top: SIZE / 2, left: 0, right: 0, borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#D9C9CC' },
  model: { userSelect: 'none', fontFamily: fonts.minchoSemi, fontSize: 86, lineHeight: 110, color: '#EBCFD4' },
  btnOutline: { minHeight: 44, borderWidth: 1.5, borderColor: colors.sumi, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.shiro },
  btnSoft: { minHeight: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.sakuraLight },
  btnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.sumi },
});
