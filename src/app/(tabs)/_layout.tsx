import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBrush, TabFan, TabHome, TabMountain, TabTalk } from '../../components/icons';
import { colors, fonts } from '../../theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.beni,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 15 },
        tabBarStyle: {
          backgroundColor: colors.shiro,
          borderTopColor: colors.sakuraLine,
          height: 64 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
        },
        sceneStyle: { backgroundColor: colors.washi },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'ホーム', tabBarIcon: ({ color }) => <TabHome color={color} /> }} />
      <Tabs.Screen
        name="chat"
        options={{ title: '会話', tabBarIcon: ({ color }) => <TabTalk color={color} />, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen name="kanji" options={{ title: '漢字', tabBarIcon: ({ color }) => <TabBrush color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: '記録', tabBarIcon: ({ color }) => <TabMountain color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: '設定', tabBarIcon: ({ color }) => <TabFan color={color} /> }} />
    </Tabs>
  );
}
