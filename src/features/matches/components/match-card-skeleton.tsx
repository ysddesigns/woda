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
  const block = (w: number, h: number, extra?: object) => (
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
      <View style={styles.header}>
        {block(120, 12)}
        {block(36, 18)}
      </View>
      <View style={styles.scoreboard}>
        <View style={styles.teamCol}>
          {block(32, 23)}
          {block(64, 12)}
        </View>
        {block(48, 24)}
        <View style={styles.teamCol}>
          {block(32, 23)}
          {block(64, 12)}
        </View>
      </View>
      {block(140, 11, { alignSelf: 'center' })}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  teamCol: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
