import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Generic two-value pill toggle, same look as matches' SegmentedFilter (DESIGN_RULES §4, §6). */
export function TwoWayToggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (key: T) => void;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
      {options.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => {
              if (option.key !== value) {
                if (process.env.EXPO_OS === 'ios') {
                  Haptics.selectionAsync();
                }
                onChange(option.key);
              }
            }}
            style={({ pressed }) => [
              styles.segment,
              selected && { backgroundColor: theme.primary },
              pressed && !selected && styles.pressed,
            ]}>
            <Text
              style={[
                styles.label,
                { color: selected ? theme.onPrimary : theme.textSecondary },
                selected && styles.labelSelected,
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: Spacing.xs / 2,
    gap: Spacing.xs / 2,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  labelSelected: {
    fontWeight: FontWeight.bold,
  },
});
