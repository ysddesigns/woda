import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import type { MatchBucket } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';

const ORDER: MatchBucket[] = ['past', 'today', 'upcoming'];
const LABELS = ['Past', 'Today', 'Upcoming'];

/** Custom pill segmented control — gold fill on the active segment (DESIGN_RULES §4, §6). */
export function SegmentedFilter({
  value,
  onChange,
}: {
  value: MatchBucket;
  onChange: (bucket: MatchBucket) => void;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
      {ORDER.map((bucket, i) => {
        const selected = bucket === value;
        return (
          <Pressable
            key={bucket}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => {
              if (bucket !== value) {
                if (process.env.EXPO_OS === 'ios') {
                  Haptics.selectionAsync();
                }
                onChange(bucket);
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
              {LABELS[i]}
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
