import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Skeleton row matching MatchCard shape (DESIGN_RULES §5 — skeletons, not spinners). */
export function MatchCardSkeleton() {
  const theme = useTheme();
  const shimmer = useSharedValue(0.4);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 750 }), -1, true);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: shimmer.value }));
  const block = (w: number, h: number) => (
    <Animated.View
      style={[{ width: w, height: h, borderRadius: Radius.sm, backgroundColor: theme.backgroundElement }, animatedStyle]}
    />
  );

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        {block(80, 12)}
        {block(40, 16)}
      </View>
      <View style={styles.row}>
        {block(28, 20)}
        {block(120, 16)}
      </View>
      <View style={styles.row}>
        {block(28, 20)}
        {block(100, 16)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
});
