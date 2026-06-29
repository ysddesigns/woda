import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { StatusBadge } from '@/features/matches/components/status-badge';
import type { Match, MatchTeam } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';

export const CARD_WIDTH = 224;
export const CARD_HEIGHT = 120;
const STAGGER_STEP_MS = 60;
const STAGGER_CAP = 5;

export function BracketMatchCard({
  match,
  index = 0,
  isFinal = false,
}: {
  match: Match;
  index?: number;
  isFinal?: boolean;
}) {
  const theme = useTheme();
  const showScore = match.status !== 'upcoming';
  const isDecided =
    match.status === 'finished' && match.homeScore !== null && match.awayScore !== null && match.homeScore !== match.awayScore;
  const homeWon = isDecided && (match.homeScore as number) > (match.awayScore as number);
  const awayWon = isDecided && (match.awayScore as number) > (match.homeScore as number);
  const isPending = match.home.isPlaceholder && match.away.isPlaceholder;

  const delay = Math.min(index, STAGGER_CAP) * STAGGER_STEP_MS;

  const borderColor = isPending ? theme.border : match.status === 'live' ? theme.live : isFinal ? theme.primary : theme.border;

  return (
    <Animated.View entering={FadeInRight.duration(300).delay(delay)}>
      <Link href={{ pathname: '/game/[id]', params: { id: match.id } }} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isPending
              ? 'Matchup not yet determined'
              : `${match.home.name} versus ${match.away.name}`
          }
          disabled={isPending}
          onPressIn={() => !isPending && Haptics.selectionAsync()}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor,
              borderWidth: match.status === 'live' || isFinal ? 1.5 : StyleSheet.hairlineWidth,
              borderStyle: isPending ? 'dashed' : 'solid',
              width: CARD_WIDTH,
            },
            isFinal && !isPending && { backgroundColor: theme.backgroundElement },
            isPending && styles.pendingCard,
            pressed && !isPending && styles.pressed,
          ]}>
          {isFinal && !isPending ? (
            <View style={[styles.finalRibbon, { backgroundColor: theme.primary }]}>
              <Ionicons name="trophy" size={10} color={theme.onPrimary} />
              <Text style={[styles.finalRibbonText, { color: theme.onPrimary }]}>FINAL</Text>
            </View>
          ) : null}
          {isPending ? (
            <View style={styles.pendingContent}>
              <Ionicons name="hourglass-outline" size={18} color={theme.textHint} />
              <Text style={[styles.pendingText, { color: theme.textHint }]} numberOfLines={2}>
                {match.home.name === 'TBD' && match.away.name === 'TBD'
                  ? 'Matchup not yet decided'
                  : `${match.home.name} vs ${match.away.name}`}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.statusRow}>
                <StatusBadge match={match} />
              </View>
              <TeamRow team={match.home} score={showScore ? match.homeScore : null} won={homeWon} lost={isDecided && !homeWon} />
              <TeamRow team={match.away} score={showScore ? match.awayScore : null} won={awayWon} lost={isDecided && !awayWon} />
            </>
          )}
        </Pressable>
      </Link>
    </Animated.View>
  );
}

function TeamRow({
  team,
  score,
  won,
  lost,
}: {
  team: MatchTeam;
  score: number | null;
  won: boolean;
  lost: boolean;
}) {
  const theme = useTheme();
  const dimmed = lost;

  return (
    <View style={[styles.teamRow, won && { backgroundColor: theme.primary + '14' }]}>
      {team.flag ? (
        <Image source={{ uri: team.flag }} style={[styles.flag, dimmed && styles.dimmed]} contentFit="cover" />
      ) : (
        <View style={[styles.flag, { backgroundColor: theme.backgroundElement }, dimmed && styles.dimmed]} />
      )}
      <Text
        style={[
          styles.teamName,
          { color: dimmed ? theme.textSecondary : theme.text },
          won && { fontWeight: FontWeight.bold },
        ]}
        numberOfLines={1}>
        {team.name}
      </Text>
      {won ? <Ionicons name="checkmark-circle" size={14} color={theme.primary} style={styles.wonIcon} /> : null}
      <Text
        style={[
          styles.score,
          { color: dimmed ? theme.textSecondary : theme.text },
          won && { color: theme.primary, fontWeight: FontWeight.bold },
        ]}>
        {score ?? (team.isPlaceholder ? '' : '–')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    borderRadius: Radius.lg,
    borderCurve: 'continuous',
    padding: Spacing.md,
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  pendingCard: {
    opacity: 0.7,
  },
  pendingContent: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  pendingText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },
  statusRow: {
    alignItems: 'flex-start',
  },
  finalRibbon: {
    position: 'absolute',
    top: -10,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  finalRibbonText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.sm,
  },
  flag: {
    width: 22,
    height: 16,
    borderRadius: 2,
  },
  dimmed: {
    opacity: 0.55,
  },
  teamName: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  wonIcon: {
    marginRight: -Spacing.xs,
  },
  score: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
    minWidth: 18,
    textAlign: 'right',
  },
});
