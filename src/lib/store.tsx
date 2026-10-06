// App state: profile, daily activity, SRS card state, English-hint toggle.
// Persisted to AsyncStorage so progress survives restarts.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Level = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type CardState = { due: number; interval: number; ease: number; reps: number };
export type DayLog = { chat: number; reviews: number };

type Persisted = {
  name: string;
  level: Level;
  days: Record<string, DayLog>;
  srs: Record<string, CardState>;
};

const DEFAULTS: Persisted = { name: 'ニコ', level: 'N3', days: {}, srs: {} };
const KEY = 'hanashi:v1';

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

type Ctx = Persisted & {
  ready: boolean;
  hints: boolean;
  toggleHints: () => void;
  setName: (n: string) => void;
  setLevel: (l: Level) => void;
  logChat: () => void;
  review: (id: string, rating: Rating) => void;
  reset: () => void;
};

export type Rating = 'again' | 'hard' | 'good' | 'easy';
const MIN = 60_000;
const DAY = 86_400_000;

// Simplified SM-2. Returns the next state and is also used to label buttons.
export function schedule(prev: CardState | undefined, rating: Rating, now = Date.now()): CardState {
  const s = prev ?? { due: 0, interval: 0, ease: 2.5, reps: 0 };
  if (rating === 'again') return { due: now + MIN, interval: 0, ease: Math.max(1.3, s.ease - 0.2), reps: 0 };
  if (rating === 'hard') {
    const interval = s.interval === 0 ? 6 * MIN : Math.max(DAY, s.interval * 1.2);
    return { due: now + interval, interval, ease: Math.max(1.3, s.ease - 0.15), reps: s.reps + 1 };
  }
  if (rating === 'good') {
    const interval = s.interval < DAY ? DAY : s.interval * s.ease;
    return { due: now + interval, interval, ease: s.ease, reps: s.reps + 1 };
  }
  const interval = s.interval < DAY ? 4 * DAY : s.interval * s.ease * 1.3;
  return { due: now + interval, interval, ease: s.ease + 0.15, reps: s.reps + 1 };
}

export function formatInterval(ms: number) {
  if (ms < 60 * MIN) return `${Math.round(ms / MIN)}分`;
  if (ms < DAY) return `${Math.round(ms / (60 * MIN))}時間`;
  return `${Math.round(ms / DAY)}日`;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Persisted>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const [hints, setHints] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setData({ ...DEFAULTS, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
  }, [data, ready]);

  const bump = useCallback((field: keyof DayLog) => {
    setData((d) => {
      const k = dayKey();
      const today = d.days[k] ?? { chat: 0, reviews: 0 };
      return { ...d, days: { ...d.days, [k]: { ...today, [field]: today[field] + 1 } } };
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...data,
      ready,
      hints,
      toggleHints: () => setHints((h) => !h),
      setName: (name) => setData((d) => ({ ...d, name })),
      setLevel: (level) => setData((d) => ({ ...d, level })),
      logChat: () => bump('chat'),
      review: (id, rating) => {
        setData((d) => ({ ...d, srs: { ...d.srs, [id]: schedule(d.srs[id], rating) } }));
        bump('reviews');
      },
      reset: () => setData((d) => ({ ...DEFAULTS, name: d.name, level: d.level })),
    }),
    [data, ready, hints, bump],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

/** Consecutive days (ending today, or yesterday if nothing yet today) with any activity. */
export function streak(days: Record<string, DayLog>) {
  const active = (d: Date) => {
    const l = days[dayKey(d)];
    return !!l && l.chat + l.reviews > 0;
  };
  const d = new Date();
  if (!active(d)) d.setDate(d.getDate() - 1);
  let n = 0;
  while (active(d)) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function lastNDays(days: Record<string, DayLog>, n = 7) {
  const out: { key: string; weekday: string; total: number; isToday: boolean }[] = [];
  const wd = ['日', '月', '火', '水', '木', '金', '土'];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const l = days[dayKey(d)];
    out.push({ key: dayKey(d), weekday: wd[d.getDay()], total: l ? l.chat + l.reviews : 0, isToday: i === 0 });
  }
  return out;
}
