import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import type { BracketRound } from '@/features/bracket/lib/group-rounds';
import { useTheme } from '@/hooks/use-theme';

const ROUND_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  r32: 'grid-outline',
  r16: 'git-branch-outline',
  qf: 'flame-outline',
  sf: 'flash-outline',
  f: 'trophy',
};

/**
 * Stands in for every round that's still 100% TBD, so the screen reads as "more is
 * coming" instead of a long scroll of near-blank placeholder match cards.
 */
export function BracketRoadAhead({ rounds }: { rounds: BracketRound[] }) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Road to the Final</Text>
      <Text style={[styles.subheading, { color: theme.textSecondary }]}>
        These stages unlock as earlier matchups are decided.
      </Text>
      {rounds.map((round, i) => {
        const isFinal = round.key === 'f';
        return (
          <View key={round.key} style={styles.row}>
            <View style={styles.rowIconColumn}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: isFinal ? theme.primary + '1F' : theme.backgroundElement },
                ]}>
                <Ionicons
                  name={ROUND_ICONS[round.key] ?? 'ellipse-outline'}
                  size={15}
                  color={isFinal ? theme.primary : theme.textHint}
                />
              </View>
              {i < rounds.length - 1 ? <View style={[styles.connector, { backgroundColor: theme.border }]} /> : null}
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.roundLabel, { color: isFinal ? theme.primary : theme.text }]}>{round.label}</Text>
              <Text style={[styles.roundCount, { color: theme.textSecondary }]}>
                {round.matches.length === 1 ? 'The decisive match' : `${round.matches.length} matchups still TBD`}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
  },
  heading: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  subheading: {
    fontSize: FontSize.xs,
    lineHeight: 16,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rowIconColumn: {
    alignItems: 'center',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    width: 2,
    flex: 1,
    marginVertical: Spacing.xs,
  },
  rowText: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  roundLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  roundCount: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
