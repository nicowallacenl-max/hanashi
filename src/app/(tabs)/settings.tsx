import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FanIcon } from '../../components/icons';
import { Card, H1, H2, Hint, HintButton } from '../../components/ui';
import { Level, useApp } from '../../lib/store';
import { tutorMode } from '../../lib/tutor';
import { colors, fonts } from '../../theme';

const LEVELS: Level[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export default function Settings() {
  const app = useApp();

  const confirmReset = () => {
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('学習記録をリセットしますか？')) app.reset();
      return;
    }
    Alert.alert('リセット', '学習記録をリセットしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: 'リセット', style: 'destructive', onPress: app.reset },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <FanIcon size={40} />
          <View style={{ flex: 1 }}>
            <H1>設定</H1>
            <Hint show={app.hints}>英 · Settings</Hint>
          </View>
          <HintButton on={app.hints} onPress={app.toggleHints} />
        </View>

        <Card style={{ gap: 10 }}>
          <H2 style={{ fontSize: 16 }}>名前</H2>
          <TextInput value={app.name} onChangeText={app.setName} accessibilityLabel="名前" style={styles.input} />
          <Hint show={app.hints}>英 · What さくら先生 calls you</Hint>
        </Card>

        <Card style={{ gap: 10 }}>
          <H2 style={{ fontSize: 16 }}>レベル</H2>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {LEVELS.map((l) => {
              const on = l === app.level;
              return (
                <Pressable
                  key={l}
                  onPress={() => app.setLevel(l)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  style={[styles.level, on && { backgroundColor: colors.beni, borderColor: colors.beni }]}
                >
                  <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: on ? colors.shiro : colors.sumi }}>{l}</Text>
                </Pressable>
              );
            })}
          </View>
          <Hint show={app.hints}>英 · The tutor adjusts vocabulary and grammar to this JLPT level</Hint>
        </Card>

        <Card style={{ gap: 6 }}>
          <H2 style={{ fontSize: 16 }}>さくら先生</H2>
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.sumi }}>
            {tutorMode === 'claude' ? 'AI接続中（Claude）' : 'オフライン練習モード'}
          </Text>
          <Hint show={app.hints}>
            {tutorMode === 'claude'
              ? '英 · Connected to the Claude tutor server'
              : '英 · Scripted replies. Set EXPO_PUBLIC_TUTOR_URL to use Claude.'}
          </Hint>
        </Card>

        <Pressable onPress={confirmReset} style={styles.reset} accessibilityRole="button">
          <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.beni }}>学習記録をリセット</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingTop: 12, gap: 14 },
  input: { height: 46, borderWidth: 1.5, borderColor: colors.sakura, borderRadius: 12, paddingHorizontal: 14, fontFamily: fonts.regular, fontSize: 16, color: colors.sumi, backgroundColor: colors.washi },
  level: { flex: 1, minHeight: 44, borderRadius: 12, borderWidth: 1.5, borderColor: colors.sakuraLine, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.shiro },
  reset: { minHeight: 48, borderRadius: 999, borderWidth: 1.5, borderColor: colors.beni, alignItems: 'center', justifyContent: 'center' },
});
