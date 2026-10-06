// Hi-fi feature icons (64-unit grid) and stroke tab icons (24-unit grid),
// ported 1:1 from the アイコン sheet on the design canvas.
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';

const { beni, sakura, sumi, shiro } = colors;
type P = { size?: number };

export const TalkIcon = ({ size = 40 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path d="M10 12h26a6 6 0 0 1 6 6v13a6 6 0 0 1-6 6H21l-8 7v-7h-3a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z" fill={sakura} />
    <Path d="M28 24h26a6 6 0 0 1 6 6v13a6 6 0 0 1-6 6h-3v7l-8-7H28a6 6 0 0 1-6-6V30a6 6 0 0 1 6-6z" fill={beni} />
    <Circle cx={33} cy={36.5} r={2.4} fill={shiro} />
    <Circle cx={41} cy={36.5} r={2.4} fill={shiro} />
    <Circle cx={49} cy={36.5} r={2.4} fill={shiro} />
  </Svg>
);

export const KanjiIcon = ({ size = 40 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path d="M8 52c9-6 19-6 27-2s17 4 22-3" fill="none" stroke={sakura} strokeWidth={6} strokeLinecap="round" />
    <G transform="rotate(40 34 30)">
      <Rect x={31} y={2} width={6} height={28} rx={2.5} fill={sumi} />
      <Rect x={29.5} y={29} width={9} height={6} rx={1.5} fill={beni} />
      <Path d="M29.5 35h9c0 8-2.5 14-4.5 18-2-4-4.5-10-4.5-18z" fill={sumi} />
    </G>
  </Svg>
);

export const VocabIcon = ({ size = 40 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path d="M32 18c-7-5-16-6-25-4v34c9-2 18-1 25 4z" fill={sakura} stroke={sumi} strokeWidth={2.5} strokeLinejoin="round" />
    <Path d="M32 18c7-5 16-6 25-4v34c-9-2-18-1-25 4z" fill={shiro} stroke={sumi} strokeWidth={2.5} strokeLinejoin="round" />
    <Path d="M44 14.5V32l4-3 4 3V13.8" fill={beni} />
    <Path d="M13 24c5-1 10 0 14 2M13 31c5-1 10 0 14 2" stroke={sumi} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.5} />
  </Svg>
);

export const ListenIcon = ({ size = 40 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path d="M12 38v-6a20 20 0 0 1 40 0v6" fill="none" stroke={sumi} strokeWidth={4.5} strokeLinecap="round" />
    <Rect x={7} y={34} width={13} height={20} rx={5} fill={beni} />
    <Rect x={44} y={34} width={13} height={20} rx={5} fill={beni} />
    <Rect x={11} y={39} width={4} height={10} rx={2} fill={sakura} />
    <Rect x={49} y={39} width={4} height={10} rx={2} fill={sakura} />
    <Path d="M27 40q5 4 0 8M32 37q8 7 0 14" fill="none" stroke={sakura} strokeWidth={3} strokeLinecap="round" />
  </Svg>
);

export const GrammarIcon = ({ size = 40 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Rect x={4} y={20} width={22} height={24} rx={5} fill={sumi} />
    <Rect x={38} y={20} width={22} height={24} rx={5} fill={sakura} />
    <Path d="M26 32h12" stroke={beni} strokeWidth={4} />
    <Circle cx={32} cy={32} r={9} fill={beni} />
    <Circle cx={32} cy={32} r={3.5} fill={shiro} />
    <Path d="M10 28h10M10 36h6" stroke={shiro} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M44 28h10M44 36h6" stroke={beni} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

export const ReadIcon = ({ size = 40 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Rect x={14} y={10} width={36} height={44} fill={shiro} stroke={sumi} strokeWidth={2.5} />
    <Rect x={9} y={6} width={46} height={7} rx={3.5} fill={sumi} />
    <Rect x={9} y={51} width={46} height={7} rx={3.5} fill={sumi} />
    <Path d="M41 19v24M33 19v18" stroke={sumi} strokeWidth={3} strokeLinecap="round" />
    <Path d="M25 19v14" stroke={sakura} strokeWidth={3} strokeLinecap="round" />
    <Rect x={20} y={38} width={8} height={8} rx={1.5} fill={beni} />
  </Svg>
);

export const StreakIcon = ({ size = 40 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx={32} cy={28} r={15} fill={beni} />
    <Path d="M4 44q7-7 14 0t14 0 14 0 14 0" fill="none" stroke={sumi} strokeWidth={3.5} strokeLinecap="round" />
    <Path d="M4 53q7-7 14 0t14 0 14 0 14 0" fill="none" stroke={sakura} strokeWidth={3.5} strokeLinecap="round" />
  </Svg>
);

export const FujiIcon = ({ size = 40, inverted = false }: P & { inverted?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Circle cx={50} cy={14} r={7} fill={beni} />
    <Path d="M3 54L23 20h18l20 34z" fill={inverted ? shiro : sumi} />
    <Path d="M23 20h18l6.5 11-5-3-4.5 4-5.5-4.5L27 32l-4.5-4L17 31z" fill={inverted ? sakura : shiro} />
  </Svg>
);

export const FanIcon = ({ size = 40 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path d="M32 54L7 26A37.5 37.5 0 0 1 57 26z" fill={sakura} />
    <Path d="M7 26A37.5 37.5 0 0 1 57 26L49.3 34.6A26 26 0 0 0 14.7 34.6z" fill={beni} />
    <Path d="M32 54L32 16.5M32 54L22.9 17.6M32 54L41.1 17.6M32 54L14.4 20.9M32 54L49.6 20.9" stroke={sumi} strokeWidth={1.4} opacity={0.55} />
    <Path d="M32 54L7 26A37.5 37.5 0 0 1 57 26z" fill="none" stroke={sumi} strokeWidth={2.5} strokeLinejoin="round" />
    <Circle cx={32} cy={54} r={4} fill={sumi} />
  </Svg>
);

export const MicIcon = ({ size = 26, color = shiro }: P & { color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Rect x={23} y={6} width={18} height={30} rx={9} fill={color} />
    <Path d="M15 30a17 17 0 0 0 34 0" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    <Path d="M32 47v9M23 57h18" stroke={color} strokeWidth={4} strokeLinecap="round" />
  </Svg>
);

const PETAL = 'M32 31c-7-5-10-13-6-21 2 2 4 2 6-1 2 3 4 3 6 1 4 8 1 16-6 21z';
export const SakuraIcon = ({ size = 40 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <G fill={sakura} stroke={beni} strokeWidth={1.5} strokeLinejoin="round">
      {[0, 72, 144, 216, 288].map((a) => (
        <Path key={a} d={PETAL} transform={`rotate(${a} 32 32)`} />
      ))}
    </G>
    <Circle cx={32} cy={32} r={4.5} fill={beni} />
  </Svg>
);

export const HintSealIcon = ({ size = 40 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Rect x={8} y={8} width={48} height={48} rx={10} fill={beni} />
    <Rect x={13} y={13} width={38} height={38} rx={6} fill="none" stroke={shiro} strokeWidth={1.5} opacity={0.7} />
    <SvgText x={32} y={42} textAnchor="middle" fontWeight="800" fontSize={26} fill={shiro}>英</SvgText>
  </Svg>
);

// ---- Tab bar stroke icons (24 grid) ----
type T = { color: import("react-native").ColorValue; size?: number };
const stroke = (color: import("react-native").ColorValue) => ({
  fill: 'none',
  stroke: color,
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const TabHome = ({ color, size = 24 }: T) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M2 10.5Q7 9 12 4q5 5 10 6.5" {...stroke(color)} />
    <Path d="M5 10v10h14V10" {...stroke(color)} />
    <Path d="M10 20v-5h4v5" {...stroke(color)} />
  </Svg>
);
export const TabTalk = ({ color, size = 24 }: T) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 4.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1z" {...stroke(color)} />
  </Svg>
);
export const TabBrush = ({ color, size = 24 }: T) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M20 3l-9 9" {...stroke(color)} />
    <Path d="M11 12c-2-.5-4.5.5-5 3-.4 2-1.6 3.4-3 4 3.5 1.2 8 .4 9-3 .4-1.6 0-3-1-4z" {...stroke(color)} />
  </Svg>
);
export const TabMountain = ({ color, size = 24 }: T) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M2 20L9.5 7h5L22 20z" {...stroke(color)} />
    <Path d="M8 9.5l2 1.5 2-1.5 2 1.5 2-1.5" {...stroke(color)} />
  </Svg>
);
export const TabFan = ({ color, size = 24 }: T) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 20L3 10a13 13 0 0 1 18 0z" {...stroke(color)} />
    <Path d="M12 20V7.2M12 20L7.6 8.4M12 20l4.4-11.6" {...stroke(color)} />
  </Svg>
);
export const BackIcon = ({ color = sumi, size = 24 }: Partial<T>) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M15 5l-7 7 7 7" {...stroke(color)} strokeWidth={2} />
  </Svg>
);
export const SpeakerIcon = ({ color = sumi, size = 22 }: Partial<T>) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" {...stroke(color)} />
    <Path d="M16 9q2 3 0 6M18.5 6.5q4.5 5.5 0 11" {...stroke(color)} />
  </Svg>
);
export const SendIcon = ({ color = shiro, size = 22 }: Partial<T>) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 12h15M14 7l5 5-5 5" {...stroke(color)} strokeWidth={2.2} />
  </Svg>
);
