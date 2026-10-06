// Traditional Japanese palette — matches the 話 Hanashi design canvas.
export const colors = {
  beni: '#B3242C', // 紅 red — primary / active
  beniDark: '#8C1A21',
  sakura: '#F4C3CC', // 桜 pink — secondary fills
  sakuraLight: '#FBE7EA', // chips, tracks
  sakuraLine: '#F3DCE0', // borders
  sumi: '#1E1A18', // 墨 ink — text, dark surfaces
  sumiSoft: '#4A403D',
  muted: '#6B5F5C', // secondary text (≥4.5:1 on white)
  shiro: '#FFFFFF', // 白 white — cards
  washi: '#FDF6F7', // screen background
} as const;

export const fonts = {
  // Display / headings (serif, brush-like)
  mincho: 'ShipporiMincho_800ExtraBold',
  minchoSemi: 'ShipporiMincho_600SemiBold',
  // Body (clean gothic)
  regular: 'ZenKakuGothicNew_400Regular',
  medium: 'ZenKakuGothicNew_500Medium',
  bold: 'ZenKakuGothicNew_700Bold',
} as const;

export const radius = { sm: 8, md: 14, lg: 18, xl: 22, pill: 999 } as const;
