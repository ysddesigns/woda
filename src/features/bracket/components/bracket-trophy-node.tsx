import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { isMatchDecided, matchCenterY } from '@/features/bracket/components/bracket-connector';
import type { Match } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';

const TROPHY_HEIGHT = 64;

/** Sits at the end of the bracket, in line with the final's connector. Reveals the champion once decided. */
export function BracketTrophyNode({ match }: { match: Match }) {
  const theme = useTheme();
  const decided = isMatchDecided(match);
  const champion = decided
    ? (match.homeScore as number) > (match.awayScore as number)
      ? match.home
      : match.away
    : null;

  const topOffset = matchCenterY(0) - TROPHY_HEIGHT / 2;

  return (
    <View style={[styles.wrap, { paddingTop: topOffset }]}>
      <Ionicons
        name="trophy"
        size={TROPHY_HEIGHT}
        color={theme.primary}
        style={!champion && styles.dimmed}
        accessibilityLabel="Trophy"
      />
      {champion ? (
        <>
          {champion.flag ? <Image source={{ uri: champion.flag }} style={styles.flag} contentFit="cover" /> : null}
          <Text style={[styles.championName, { color: theme.primary }]} numberOfLines={1}>
            {champion.name}
          </Text>
          <Text style={[styles.championLabel, { color: theme.textSecondary }]}>CHAMPION</Text>
        </>
      ) : (
        <Text style={[styles.tbd, { color: theme.textSecondary }]}>Champion TBD</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 100,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dimmed: {
    opacity: 0.3,
  },
  flag: {
    width: 26,
    height: 18,
    borderRadius: 2,
    marginTop: Spacing.xs,
  },
  championName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  championLabel: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.6,
  },
  tbd: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
