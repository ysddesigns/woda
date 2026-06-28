import { format } from 'date-fns';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { StateView } from '@/components/state-view';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { StatusBadge } from '@/features/matches/components/status-badge';
import { useMatches } from '@/features/matches/hooks/use-matches';
import type { MatchTeam } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';

/**
 * Match detail (MVP stub). Reads from the cached games list — the API's /get/game/{id}
 * endpoint is unreliable. Phase 2 fleshes this out with lineups, events, and stats.
 */
export default function GameDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { allById } = useMatches();
  const match = id ? allById.get(id) : undefined;

  if (!match) {
    return (
      <StateView emoji="🔍" title="Match not found" description="This match isn’t available right now." />
    );
  }

  const kickoff = Number.isNaN(match.kickoff.getTime())
    ? null
    : format(match.kickoff, 'EEE d MMM · HH:mm');

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <View style={styles.statusRow}>
        <StatusBadge match={match} />
      </View>

      <View style={[styles.scoreboard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TeamColumn team={match.home} />
        <View style={styles.scoreCenter}>
          {match.status === 'upcoming' ? (
            <Text style={[styles.vs, { color: theme.textSecondary }]}>vs</Text>
          ) : (
            <Text style={[styles.score, { color: theme.text }]} selectable>
              {match.homeScore ?? '–'} : {match.awayScore ?? '–'}
            </Text>
          )}
        </View>
        <TeamColumn team={match.away} />
      </View>

      <View style={styles.meta}>
        {kickoff ? <MetaRow label="Kickoff" value={kickoff} /> : null}
        {match.venue ? <MetaRow label="Venue" value={`${match.venue.name}, ${match.venue.city}`} /> : null}
        <MetaRow label="Stage" value={match.group} />
      </View>
    </ScrollView>
  );
}

function TeamColumn({ team }: { team: MatchTeam }) {
  const theme = useTheme();
  return (
    <View style={styles.teamCol}>
      {team.flag ? (
        <Image source={{ uri: team.flag }} style={styles.flag} contentFit="cover" transition={150} />
      ) : (
        <View style={[styles.flag, styles.flagFallback, { backgroundColor: theme.backgroundElement }]}>
          <Text style={{ color: theme.textSecondary, fontWeight: FontWeight.bold }}>
            {team.fifaCode ?? '?'}
          </Text>
        </View>
      )}
      <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={2}>
        {team.name}
      </Text>
    </View>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.metaRow, { borderBottomColor: theme.border }]}>
      <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.metaValue, { color: theme.text }]} selectable>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  statusRow: {
    alignItems: 'center',
  },
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  teamCol: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  flag: {
    width: 56,
    height: 40,
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  flagFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  scoreCenter: {
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.sm,
  },
  score: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  vs: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  meta: {
    gap: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.lg,
  },
  metaLabel: {
    fontSize: FontSize.base,
  },
  metaValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    flexShrink: 1,
    textAlign: 'right',
  },
});
