import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import type { VenueSummary } from '@/features/venues/types';
import { useTheme } from '@/hooks/use-theme';

export function VenueRow({ venue }: { venue: VenueSummary }) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${venue.name}, ${venue.city}`}
      onPress={() => router.push({ pathname: '/teams/venue/[id]', params: { id: venue.id } })}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.card, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <View style={styles.main}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {venue.name}
        </Text>
        <Text style={[styles.location, { color: theme.textSecondary }]} numberOfLines={1}>
          {venue.city}, {venue.country}
        </Text>
      </View>
      <View style={styles.statsCol}>
        <Text style={[styles.capacity, { color: theme.text }]}>{venue.capacity.toLocaleString()}</Text>
        <View style={[styles.regionBadge, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.regionText, { color: theme.textSecondary }]}>{venue.region}</Text>
        </View>
      </View>
    </Pressable>
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
  pressed: {
    opacity: 0.85,
  },
  main: {
    flex: 1,
    gap: Spacing.xs,
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  location: {
    fontSize: FontSize.sm,
  },
  statsCol: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  capacity: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    fontVariant: ['tabular-nums'],
  },
  regionBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  regionText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
