import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function TeamRowSkeleton() {
  const theme = useTheme();
  const shimmer = useSharedValue(0.4);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 750 }), -1, true);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: shimmer.value }));

  return (
    <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Animated.View
        style={[styles.flag, { backgroundColor: theme.backgroundElement }, animatedStyle]}
      />
      <Animated.View
        style={[styles.name, { backgroundColor: theme.backgroundElement }, animatedStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  flag: {
    width: 32,
    height: 23,
    borderRadius: 4,
  },
  name: {
    flex: 1,
    height: 16,
    borderRadius: Radius.sm,
  },
});
