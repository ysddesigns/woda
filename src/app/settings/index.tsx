import { SegmentedControl } from '@expo/ui/community/segmented-control';
import Constants from 'expo-constants';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { type ThemePreference, useSettingsStore } from '@/store/settings-store';

const THEME_VALUES: ThemePreference[] = ['system', 'light', 'dark'];
const THEME_LABELS = ['System', 'Light', 'Dark'];

export default function SettingsScreen() {
  const theme = useTheme();
  const themePreference = useSettingsStore((s) => s.themePreference);
  const setThemePreference = useSettingsStore((s) => s.setThemePreference);
  const version = Constants.expoConfig?.version ?? '1.0.0';

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

      <Section title="About">
        <Row label="Version" value={version} />
        <Row label="Data source" value="worldcup26.ir" />
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
