import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Skeleton block matching StandingsTable shape (DESIGN_RULES §5 — skeletons, not spinners). */
export function StandingsTableSkeleton() {
  const theme = useTheme();
  const shimmer = useSharedValue(0.4);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 750 }), -1, true);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: shimmer.value }));
  const block = (w: number | `${number}%`, h: number, extra?: object) => (
    <Animated.View
      style={[
        { width: w, height: h, borderRadius: Radius.sm, backgroundColor: theme.backgroundElement },
        extra,
        animatedStyle,
      ]}
    />
  );

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {block(80, 11)}
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} style={styles.row}>
          {block('70%', 14)}
          {block(28, 14)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
