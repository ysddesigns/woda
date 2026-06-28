import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { StatusBadge } from '@/features/matches/components/status-badge';
import type { Match, MatchTeam } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';

const CARD_WIDTH = 220;

export function BracketMatchCard({ match }: { match: Match }) {
  const theme = useTheme();
  const showScore = match.status !== 'upcoming';

  return (
    <Link href={{ pathname: '/game/[id]', params: { id: match.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${match.home.name} versus ${match.away.name}`}
        onPressIn={() => Haptics.selectionAsync()}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border, width: CARD_WIDTH },
          pressed && styles.pressed,
        ]}>
        <View style={styles.statusRow}>
          <StatusBadge match={match} />
        </View>
        <TeamRow team={match.home} score={showScore ? match.homeScore : null} />
        <TeamRow team={match.away} score={showScore ? match.awayScore : null} />
      </Pressable>
    </Link>
  );
}

function TeamRow({ team, score }: { team: MatchTeam; score: number | null }) {
  const theme = useTheme();
  return (
    <View style={styles.teamRow}>
      {team.flag ? (
        <Image source={{ uri: team.flag }} style={styles.flag} contentFit="cover" />
      ) : (
        <View style={[styles.flag, { backgroundColor: theme.backgroundElement }]} />
      )}
      <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={1}>
        {team.name}
      </Text>
      <Text style={[styles.score, { color: theme.text }]}>{score ?? (team.isPlaceholder ? '' : '–')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  statusRow: {
    alignItems: 'flex-start',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  flag: {
    width: 22,
    height: 16,
    borderRadius: 2,
  },
  teamName: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  score: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
    minWidth: 16,
    textAlign: 'right',
  },
});
