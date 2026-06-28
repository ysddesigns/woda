import { format } from 'date-fns';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Match } from '@/features/matches/types';

/**
 * Status indicator: pulsing LIVE dot + minute, "FT" for finished, or kickoff time for upcoming.
 * Color is never the only signal (DESIGN_RULES §13) — text label is always present.
 */
export function StatusBadge({ match }: { match: Match }) {
  const theme = useTheme();

  if (match.status === 'live') {
    return (
      <View style={[styles.badge, { backgroundColor: theme.live + '22' }]}>
        <LiveDot color={theme.live} />
        <Text style={[styles.liveText, { color: theme.live }]} selectable>
          {match.minute ? `${match.minute}'` : 'LIVE'}
        </Text>
      </View>
    );
  }

  if (match.status === 'finished') {
    return (
      <View style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
        <Text style={[styles.metaText, { color: theme.textSecondary }]} selectable>
          FT
        </Text>
      </View>
    );
  }

  const time = Number.isNaN(match.kickoff.getTime()) ? '—' : format(match.kickoff, 'HH:mm');
  return (
    <View style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
      <Text
        style={[styles.metaText, { color: theme.textSecondary, fontVariant: ['tabular-nums'] }]}
        selectable>
        {time}
      </Text>
    </View>
  );
}

function LiveDot({ color }: { color: string }) {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.3, { duration: 700 }), -1, true);
  }, [opacity]);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.dot, { backgroundColor: color }, animatedStyle]} />;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    borderCurve: 'continuous',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
  },
  liveText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  metaText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
