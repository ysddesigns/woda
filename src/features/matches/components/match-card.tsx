import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { StatusBadge } from '@/features/matches/components/status-badge';
import type { Match, MatchTeam } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';

function stageLabel(match: Match): string {
  const map: Record<string, string> = {
    group: `Group ${match.group}`,
    r32: 'Round of 32',
    r16: 'Round of 16',
    qf: 'Quarter-final',
    sf: 'Semi-final',
    f: 'Final',
  };
  return map[match.stage] ?? match.group;
}

export const MatchCard = memo(function MatchCard({ match }: { match: Match }) {
  const theme = useTheme();
  const showScore = match.status !== 'upcoming';
  const homeWins = showScore && match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore;
  const awayWins = showScore && match.homeScore !== null && match.awayScore !== null && match.awayScore > match.homeScore;

  return (
    <Link href={{ pathname: '/game/[id]', params: { id: match.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${match.home.name} versus ${match.away.name}, ${stageLabel(match)}`}
        onPressIn={() => Haptics.selectionAsync()}
        android_ripple={{ color: theme.backgroundSelected }}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
          pressed && styles.pressed,
        ]}>
        <View style={styles.header}>
          <Text style={[styles.stage, { color: theme.textSecondary }]} numberOfLines={1}>
            {stageLabel(match)}
            {match.matchday ? ` · Matchday ${match.matchday}` : ''}
          </Text>
          <StatusBadge match={match} />
        </View>

        <View style={styles.scoreboard}>
          <TeamColumn team={match.home} />
          <View style={styles.scoreCenter}>
            {showScore ? (
              <Text style={[styles.score, { color: theme.text }]} selectable>
                <Text style={homeWins ? { color: theme.primary } : undefined}>{match.homeScore ?? '–'}</Text>
                <Text style={{ color: theme.textSecondary }}> : </Text>
                <Text style={awayWins ? { color: theme.primary } : undefined}>{match.awayScore ?? '–'}</Text>
              </Text>
            ) : (
              <Text style={[styles.vs, { color: theme.textSecondary }]}>vs</Text>
            )}
          </View>
          <TeamColumn team={match.away} />
        </View>

        {match.venue ? (
          <View style={styles.venueRow}>
            <Ionicons name="location-outline" size={12} color={theme.textHint} />
            <Text style={[styles.venue, { color: theme.textHint }]} numberOfLines={1}>
              {match.venue.name}, {match.venue.city}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </Link>
  );
});

function TeamColumn({ team }: { team: MatchTeam }) {
  const theme = useTheme();
  return (
    <View style={styles.teamCol}>
      <Flag team={team} />
      <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={2}>
        {team.name}
      </Text>
    </View>
  );
}

function Flag({ team }: { team: MatchTeam }) {
  const theme = useTheme();
  if (team.flag) {
    return (
      <Image
        source={{ uri: team.flag }}
        style={styles.flag}
        contentFit="cover"
        transition={150}
        accessibilityLabel={`${team.name} flag`}
      />
    );
  }
  // Placeholder fallback (initials on brand color) — never default grey (DESIGN_RULES §9).
  return (
    <View style={[styles.flag, styles.flagFallback, { backgroundColor: theme.backgroundElement }]}>
      <Text style={[styles.flagInitials, { color: theme.textSecondary }]}>{team.fifaCode ?? '?'}</Text>
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
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  stage: {
    flex: 1,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  flag: {
    width: 32,
    height: 23,
    borderRadius: 4,
    borderCurve: 'continuous',
  },
  flagFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagInitials: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  teamName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  scoreCenter: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  vs: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  venue: {
    fontSize: FontSize.xs,
  },
});
