import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import type { StandingsGroup } from '@/features/standings/types';
import { useTheme } from '@/hooks/use-theme';

export function StandingsTable({ group }: { group: StandingsGroup }) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>{`GROUP ${group.name}`}</Text>

      <View style={styles.headerRow}>
        <Text style={[styles.teamHeader, { color: theme.textHint }]}>Team</Text>
        {COLUMNS.map((c) => (
          <Text key={c.key} style={[styles.statHeader, { color: theme.textHint }]}>
            {c.label}
          </Text>
        ))}
      </View>

      {group.rows.map((row, i) => (
        <View key={row.team.id} style={styles.row}>
          <View style={styles.teamCell}>
            <Text style={[styles.rank, { color: theme.textHint }]}>{i + 1}</Text>
            {row.team.flag ? (
              <Image source={{ uri: row.team.flag }} style={styles.flag} contentFit="cover" />
            ) : (
              <View style={[styles.flag, { backgroundColor: theme.backgroundElement }]} />
            )}
            <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={1}>
              {row.team.name}
            </Text>
          </View>
          {COLUMNS.map((c) => (
            <Text
              key={c.key}
              style={[
                styles.statCell,
                { color: c.key === 'points' ? theme.text : theme.textSecondary },
                c.key === 'points' && styles.points,
              ]}>
              {c.value(row)}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const COLUMNS: { key: string; label: string; value: (row: StandingsGroup['rows'][number]) => string }[] = [
  { key: 'played', label: 'MP', value: (r) => String(r.played) },
  { key: 'won', label: 'W', value: (r) => String(r.won) },
  { key: 'drawn', label: 'D', value: (r) => String(r.drawn) },
  { key: 'lost', label: 'L', value: (r) => String(r.lost) },
  { key: 'goalDiff', label: 'GD', value: (r) => (r.goalDiff > 0 ? `+${r.goalDiff}` : String(r.goalDiff)) },
  { key: 'points', label: 'PTS', value: (r) => String(r.points) },
];

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  groupTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  teamHeader: {
    flex: 1,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  teamCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rank: {
    width: 16,
    fontSize: FontSize.xs,
    fontVariant: ['tabular-nums'],
  },
  flag: {
    width: 20,
    height: 14,
    borderRadius: 2,
  },
  teamName: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  statHeader: {
    width: 28,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  statCell: {
    width: 28,
    fontSize: FontSize.sm,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  points: {
    fontWeight: FontWeight.bold,
  },
});
