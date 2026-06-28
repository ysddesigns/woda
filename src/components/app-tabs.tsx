import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useTheme } from '@/hooks/use-theme';

/**
 * Bottom navigation. Ships Matches, Standings, Bracket, Teams, Settings — 5 tabs, the cap
 * for NativeTabs on Android. Venues lives inside the Teams tab; Search is an in-app modal.
 */
export default function AppTabs() {
  const theme = useTheme();

  return (
    <NativeTabs tintColor={theme.primary}>
      <NativeTabs.Trigger name="(matches)">
        <NativeTabs.Trigger.Icon sf="soccerball" md="sports_soccer" />
        <NativeTabs.Trigger.Label>Matches</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="standings">
        <NativeTabs.Trigger.Icon sf="list.number" md="leaderboard" />
        <NativeTabs.Trigger.Label>Standings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="bracket">
        <NativeTabs.Trigger.Icon sf="trophy" md="emoji_events" />
        <NativeTabs.Trigger.Label>Bracket</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="teams">
        <NativeTabs.Trigger.Icon sf="person.2" md="groups" />
        <NativeTabs.Trigger.Label>Teams</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gearshape" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
