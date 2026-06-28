import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useTheme } from '@/hooks/use-theme';

/**
 * Bottom navigation. MVP ships Matches + Settings; Phase-2 tabs (Standings, Bracket, Teams)
 * are added here later via OTA — tabs must stay static (≤5 on Android).
 */
export default function AppTabs() {
  const theme = useTheme();

  return (
    <NativeTabs tintColor={theme.primary}>
      <NativeTabs.Trigger name="(matches)">
        <NativeTabs.Trigger.Icon sf="soccerball" md="sports_soccer" />
        <NativeTabs.Trigger.Label>Matches</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gearshape" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
