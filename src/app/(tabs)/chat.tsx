import * as Speech from 'expo-speech';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { BackIcon, SendIcon, SpeakerIcon } from '../../components/icons';
import { Furigana, HintButton, stripFurigana } from '../../components/ui';
import { topicForToday, topics } from '../../data/topics';
import { useApp } from '../../lib/store';
import { askTutor, ChatMessage, TutorTurn, tutorMode } from '../../lib/tutor';
import { colors, fonts } from '../../theme';

type Msg =
  | { id: number; role: 'assistant'; turn: TutorTurn; showEn: boolean }
  | { id: number; role: 'user'; text: string; turnFeedback?: TutorTurn['correction']; showEn: boolean };

let nextId = 1;
const speak = (ja: string) => Speech.speak(stripFurigana(ja), { language: 'ja-JP', rate: 0.9 });

export default function Chat() {
  const app = useApp();
  const params = useLocalSearchParams<{ topic?: string }>();
  const topic = topics.find((t) => t.id === params.topic) ?? topicForToday();

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    setMsgs([{ id: nextId++, role: 'assistant', showEn: false, turn: { ja: `${app.name}さん、${topic.opener.ja}`, en: topic.opener.en, suggestions: [] } }]);
  }, [topic.id]);

  const lastTurn = [...msgs].reverse().find((m) => m.role === 'assistant') as Extract<Msg, { role: 'assistant' }> | undefined;

  const toggle = (id: number) => setMsgs((ms) => ms.map((m) => (m.id === id ? { ...m, showEn: !m.showEn } : m)));

  async function send(text = input.trim()) {
    if (!text || busy) return;
    setInput('');
    setError(null);
    const userMsg: Msg = { id: nextId++, role: 'user', text, showEn: false };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setBusy(true);
    app.logChat();
    try {
      const history: ChatMessage[] = next.map((m) =>
        m.role === 'user' ? { role: 'user', content: m.text } : { role: 'assistant', content: stripFurigana(m.turn.ja) },
      );
      const turn = await askTutor({ history, topic, level: app.level, name: app.name });
      setMsgs((ms) => [
        ...ms.map((m) => (m.id === userMsg.id ? { ...m, turnFeedback: turn.correction } : m)),
        { id: nextId++, role: 'assistant', turn, showEn: false },
      ]);
    } catch (e) {
      setError('先生に接続できませんでした。もう一度試してください。');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.washi }} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} accessibilityRole="button" accessibilityLabel="ホームに戻る" style={styles.iconBtn}>
          <BackIcon />
        </Pressable>
        <View style={styles.avatar}>
          <Text style={{ fontFamily: fonts.mincho, fontSize: 18, color: colors.shiro }}>桜</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.sumi }}>さくら先生</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.muted }} numberOfLines={1}>
            {`会話 · ${stripFurigana(topic.title)}`}
          </Text>
        </View>
        <View style={styles.levelChip}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: colors.beni }}>{app.level}</Text>
        </View>
        <Pressable onPress={() => lastTurn && speak(lastTurn.turn.ja)} accessibilityRole="button" accessibilityLabel="最後のメッセージを読み上げる" style={styles.iconBtn}>
          <SpeakerIcon />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} contentContainerStyle={styles.thread} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
          {tutorMode === 'offline' && (
            <Text style={styles.modeNote}>オフライン練習モード</Text>
          )}
          {msgs.map((m) =>
            m.role === 'assistant' ? (
              <View key={m.id} style={styles.aiRow}>
                <View style={styles.aiBubble}>
                  <Furigana text={m.turn.ja} size={16} />
                  {m.showEn && <Text style={styles.en}>{m.turn.en}</Text>}
                </View>
                <View style={{ gap: 6 }}>
                  <HintButton size="sm" on={m.showEn} onPress={() => toggle(m.id)} />
                  <Pressable onPress={() => speak(m.turn.ja)} accessibilityRole="button" accessibilityLabel="読み上げ" hitSlop={8} style={styles.smallBtn}>
                    <SpeakerIcon size={16} />
                  </Pressable>
                </View>
              </View>
            ) : (
              <View key={m.id} style={{ gap: 10 }}>
                <View style={styles.userBubble}>
                  <Text style={styles.userText}>{m.text}</Text>
                </View>
                {m.turnFeedback && (
                  <View style={styles.correction} accessibilityLabel="添削">
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Svg width={18} height={18} viewBox="0 0 64 64">
                          <Path d="M32 54L7 26A37.5 37.5 0 0 1 57 26z" fill={colors.sakura} />
                          <Path d="M7 26A37.5 37.5 0 0 1 57 26L49.3 34.6A26 26 0 0 0 14.7 34.6z" fill={colors.beni} />
                          <Circle cx={32} cy={54} r={4} fill={colors.sumi} />
                        </Svg>
                        <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.beni }}>添削</Text>
                      </View>
                      <HintButton size="sm" on={m.showEn} onPress={() => toggle(m.id)} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <Text style={styles.wrong}>{m.turnFeedback.wrong}</Text>
                      <Text style={{ color: colors.beni, fontSize: 16 }}>→</Text>
                      <Text style={styles.right}>{m.turnFeedback.right}</Text>
                    </View>
                    <Furigana text={m.turnFeedback.explanation} size={14} />
                    {m.showEn && <Text style={styles.en}>{m.turnFeedback.en}</Text>}
                  </View>
                )}
              </View>
            ),
          )}
          {busy && (
            <View style={[styles.aiBubble, { alignSelf: 'flex-start', flexDirection: 'row', gap: 8, alignItems: 'center' }]}>
              <ActivityIndicator color={colors.beni} size="small" />
              <Text style={{ fontFamily: fonts.regular, color: colors.muted }}>考え中…</Text>
            </View>
          )}
          {error && <Text style={{ fontFamily: fonts.bold, color: colors.beni, textAlign: 'center' }}>{error}</Text>}
        </ScrollView>

        <View style={styles.composer}>
          {!!lastTurn?.turn.suggestions.length && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: colors.muted }}>ヒント</Text>
              {lastTurn.turn.suggestions.map((s) => (
                <Pressable key={s} onPress={() => setInput(stripFurigana(s))} style={styles.chip} accessibilityRole="button">
                  <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.sumi }}>{stripFurigana(s)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => send()}
              placeholder="日本語で返信…"
              placeholderTextColor={colors.muted}
              accessibilityLabel="返信"
              returnKeyType="send"
              style={styles.input}
            />
            <Pressable onPress={() => send()} disabled={busy || !input.trim()} accessibilityRole="button" accessibilityLabel="送信" style={[styles.sendBtn, (busy || !input.trim()) && { opacity: 0.5 }]}>
              <SendIcon />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, paddingVertical: 8, backgroundColor: colors.shiro, borderBottomWidth: 1, borderBottomColor: colors.sakuraLine },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.beni, alignItems: 'center', justifyContent: 'center' },
  levelChip: { backgroundColor: colors.sakuraLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  thread: { padding: 16, gap: 14 },
  modeNote: { alignSelf: 'center', fontFamily: fonts.regular, fontSize: 12, color: colors.muted, backgroundColor: colors.shiro, borderWidth: 1, borderColor: colors.sakuraLine, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, overflow: 'hidden' },
  aiRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '92%' },
  aiBubble: { flexShrink: 1, backgroundColor: colors.shiro, borderWidth: 1, borderColor: colors.sakuraLine, borderRadius: 18, borderBottomLeftRadius: 6, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  smallBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  en: { fontFamily: fonts.medium, fontSize: 13, color: colors.beni, borderTopWidth: 1, borderTopColor: colors.sakura, borderStyle: 'dashed', paddingTop: 6 },
  userBubble: { alignSelf: 'flex-end', maxWidth: '84%', backgroundColor: colors.sumi, borderRadius: 18, borderBottomRightRadius: 6, paddingHorizontal: 14, paddingVertical: 12 },
  userText: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 26, color: colors.shiro },
  correction: { backgroundColor: colors.shiro, borderWidth: 1.5, borderColor: colors.beni, borderRadius: 16, padding: 14, gap: 8 },
  wrong: { fontFamily: fonts.regular, fontSize: 16, color: colors.muted, textDecorationLine: 'line-through' },
  right: { fontFamily: fonts.bold, fontSize: 16, color: colors.beni, backgroundColor: colors.sakuraLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  composer: { backgroundColor: colors.shiro, borderTopWidth: 1, borderTopColor: colors.sakuraLine, padding: 12, gap: 10 },
  chip: { minHeight: 36, justifyContent: 'center', backgroundColor: colors.sakuraLight, borderRadius: 999, paddingHorizontal: 14 },
  input: { flex: 1, height: 46, borderWidth: 1.5, borderColor: colors.sakura, borderRadius: 999, paddingHorizontal: 16, fontFamily: fonts.regular, fontSize: 15, backgroundColor: colors.washi, color: colors.sumi },
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.beni, alignItems: 'center', justifyContent: 'center' },
});
