import { SegmentedControl } from '@expo/ui/community/segmented-control';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { isEnabled } from '@/lib/feature-flags';
import { requestNotificationPermission } from '@/lib/notifications';
import { type ThemePreference, useSettingsStore } from '@/store/settings-store';

const THEME_VALUES: ThemePreference[] = ['system', 'light', 'dark'];
const THEME_LABELS = ['System', 'Light', 'Dark'];
const PRIVACY_POLICY_URL = 'https://ysddesigns.github.io/woda/privacy/';

export default function SettingsScreen() {
  const theme = useTheme();
  const themePreference = useSettingsStore((s) => s.themePreference);
  const setThemePreference = useSettingsStore((s) => s.setThemePreference);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);
  const [requesting, setRequesting] = useState(false);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  async function onToggleNotifications(next: boolean) {
    if (!next) {
      setNotificationsEnabled(false);
      return;
    }
    setRequesting(true);
    const result = await requestNotificationPermission();
    setRequesting(false);

    if (result === 'granted') {
      setNotificationsEnabled(true);
      return;
    }
    if (result === 'unsupported') {
      Alert.alert('Not available', 'Notifications require a physical device.');
      return;
    }
    Alert.alert(
      'Notifications off',
      'Enable notifications for Woda in your device Settings to get match alerts.',
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <Section title="Appearance">
        <Text style={[styles.label, { color: theme.textSecondary }]}>Theme</Text>
        <SegmentedControl
          values={THEME_LABELS}
          selectedIndex={THEME_VALUES.indexOf(themePreference)}
          onChange={({ nativeEvent }) => {
            const next = THEME_VALUES[nativeEvent.selectedSegmentIndex];
            if (next) setThemePreference(next);
          }}
        />
      </Section>

      {isEnabled('notifications') ? (
        <Section title="Notifications">
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Match alerts</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={onToggleNotifications}
              disabled={requesting}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
          <Text style={[styles.note, { color: theme.textHint }]}>
            Get notified for kickoffs and goals once favorite teams are available.
          </Text>
        </Section>
      ) : null}

      <Section title="About">
        <Row label="Version" value={version} />
        <Row label="Data source" value="worldcup26.ir" />
        <Pressable onPress={() => WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL)}>
          <Text style={[styles.rowLabel, { color: theme.primary }]}>Privacy Policy</Text>
        </Pressable>
        <Text style={[styles.note, { color: theme.textHint }]} selectable>
          Woda is an unofficial companion app. Match data is provided by the open worldcup26.ir
          API. No personal data is collected.
        </Text>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>{title.toUpperCase()}</Text>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>{children}</View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.textSecondary }]} selectable>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    gap: Spacing['2xl'],
  },
  section: {
    gap: Spacing.sm,
  },
  sectionHeader: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.xs,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  rowLabel: {
    fontSize: FontSize.md,
  },
  rowValue: {
    fontSize: FontSize.base,
    flexShrink: 1,
    textAlign: 'right',
  },
  note: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
});
