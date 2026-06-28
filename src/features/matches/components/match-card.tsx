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

  return (
    <Link href={{ pathname: '/game/[id]', params: { id: match.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${match.home.name} versus ${match.away.name}, ${stageLabel(match)}`}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
          pressed && styles.pressed,
        ]}>
        <View style={styles.header}>
          <Text style={[styles.stage, { color: theme.textSecondary }]} numberOfLines={1}>
            {stageLabel(match)}
          </Text>
          <StatusBadge match={match} />
        </View>

        <View style={styles.teams}>
          <TeamRow team={match.home} score={match.homeScore} showScore={showScore} />
          <TeamRow team={match.away} score={match.awayScore} showScore={showScore} />
        </View>

        {match.venue ? (
          <Text style={[styles.venue, { color: theme.textHint }]} numberOfLines={1}>
            {match.venue.name} · {match.venue.city}
          </Text>
        ) : null}
      </Pressable>
    </Link>
  );
});

function TeamRow({ team, score, showScore }: { team: MatchTeam; score: number | null; showScore: boolean }) {
  const theme = useTheme();
  return (
    <View style={styles.teamRow}>
      <Flag team={team} />
      <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={1}>
        {team.name}
      </Text>
      {showScore ? (
        <Text style={[styles.score, { color: theme.text, fontVariant: ['tabular-nums'] }]} selectable>
          {score ?? '–'}
        </Text>
      ) : null}
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
      <Text style={[styles.flagInitials, { color: theme.textSecondary }]}>
        {team.fifaCode ?? '?'}
      </Text>
    </View>
  );
}

const FLAG_WIDTH = 28;

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    padding: Spacing.lg,
    gap: Spacing.md,
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
  teams: {
    gap: Spacing.md,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  flag: {
    width: FLAG_WIDTH,
    height: FLAG_WIDTH * 0.7,
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
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  score: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    minWidth: 20,
    textAlign: 'right',
  },
  venue: {
    fontSize: FontSize.xs,
  },
});
