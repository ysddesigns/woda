import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Underlined gold-active tab bar for the match details screen. */
export function TabBar<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      {tabs.map((t) => {
        const selected = t.key === value;
        return (
          <Pressable
            key={t.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => {
              if (t.key !== value) {
                if (process.env.EXPO_OS === 'ios') {
                  Haptics.selectionAsync();
                }
                onChange(t.key);
              }
            }}
            style={styles.tab}>
            <Text
              style={[
                styles.label,
                { color: selected ? theme.primary : theme.textSecondary },
                selected && styles.labelSelected,
              ]}>
              {t.label.toUpperCase()}
            </Text>
            <View style={[styles.indicator, selected && { backgroundColor: theme.primary }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
  },
  labelSelected: {
    fontWeight: FontWeight.bold,
  },
  indicator: {
    height: 2,
    width: '70%',
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
});
