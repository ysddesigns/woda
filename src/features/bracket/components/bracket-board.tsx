import Ionicons from '@expo/vector-icons/Ionicons';
import { Fragment } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { StateView } from '@/components/state-view';
import { BottomTabInset, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { BracketConnector } from '@/features/bracket/components/bracket-connector';
import { BracketMatchCard, isFullyPending } from '@/features/bracket/components/bracket-match-card';
import { BracketRoadAhead } from '@/features/bracket/components/bracket-road-ahead';
import { BracketTrophyNode } from '@/features/bracket/components/bracket-trophy-node';
import type { BracketRound } from '@/features/bracket/lib/group-rounds';
import { useTheme } from '@/hooks/use-theme';

type BracketBoardProps = {
  rounds: BracketRound[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  refreshing: boolean;
  onRefresh: () => void;
};

const ROUND_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  r32: 'grid-outline',
  r16: 'git-branch-outline',
  qf: 'flame-outline',
  sf: 'flash-outline',
  f: 'trophy',
};

/** True when round B is the natural next stage that round A's matches merge into (A halves into B). */
function isDirectPairing(a: BracketRound, b: BracketRound): boolean {
  return a.matches.length >= 2 && a.matches.length % 2 === 0 && b.matches.length === a.matches.length / 2;
}

export function BracketBoard({
  rounds,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  refreshing,
  onRefresh,
}: BracketBoardProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={styles.skeletonWrap}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} style={styles.skeletonColumn}>
            <View style={[styles.skeletonChip, { backgroundColor: theme.backgroundElement }]} />
            {Array.from({ length: 2 }).map((__, j) => (
              <View key={j} style={[styles.skeletonCard, { backgroundColor: theme.backgroundElement }]} />
            ))}
          </View>
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <StateView
        icon="cloud-offline-outline"
        title="Couldn't load the bracket"
        description={errorMessage}
        actionLabel="Try Again"
        onAction={onRetry}
      />
    );
  }

  if (rounds.length === 0) {
    return (
      <StateView
        icon="trophy-outline"
        title="The bracket isn't set yet"
        description="The knockout stage will appear here once group play decides the matchups."
      />
    );
  }

  // A round only earns its own column once at least one slot is known. Rounds that are
  // still 100% TBD (e.g. every stage after the one currently being played) get bundled
  // into a single "what's coming" card instead of a wall of near-blank placeholder cards.
  const frontierIndex = rounds.reduce(
    (last, round, i) => (round.matches.some((m) => !isFullyPending(m)) ? i : last),
    -1,
  );
  const activeRounds = rounds.slice(0, frontierIndex + 1);
  const futureRounds = rounds.slice(frontierIndex + 1);
  const revealedByRound = activeRounds.map((round) => round.matches.filter((m) => !isFullyPending(m)));

  const lastActive = activeRounds[activeRounds.length - 1];
  const showTrophy = !!lastActive && lastActive.key === 'f' && lastActive.matches.length === 1;

  return (
    <ScrollView
      style={styles.verticalScroll}
      contentContainerStyle={styles.verticalContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.textSecondary} />
      }>
      <ScrollView horizontal contentContainerStyle={styles.content} showsHorizontalScrollIndicator={false}>
        {activeRounds.map((round, roundIndex) => {
          const isFinal = round.key === 'f';
          const revealed = revealedByRound[roundIndex];
          const pendingCount = round.matches.length - revealed.length;
          const nextRound = activeRounds[roundIndex + 1];
          const canConnect = nextRound ? isDirectPairing({ ...round, matches: revealed }, nextRound) : false;

          return (
            <Fragment key={round.key}>
              <View style={styles.column}>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: isFinal ? theme.primary + '1F' : theme.backgroundElement },
                  ]}>
                  <Ionicons
                    name={ROUND_ICONS[round.key] ?? 'ellipse-outline'}
                    size={13}
                    color={isFinal ? theme.primary : theme.textSecondary}
                  />
                  <Text style={[styles.columnTitle, { color: isFinal ? theme.primary : theme.textSecondary }]}>
                    {round.label.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.cards}>
                  {revealed.map((match, index) => (
                    <BracketMatchCard key={match.id} match={match} index={index} isFinal={isFinal} />
                  ))}
                  {pendingCount > 0 ? (
                    <View style={[styles.tbdPill, { borderColor: theme.border }]}>
                      <Ionicons name="hourglass-outline" size={14} color={theme.textHint} />
                      <Text style={[styles.tbdPillText, { color: theme.textHint }]}>
                        +{pendingCount} matchup{pendingCount === 1 ? '' : 's'} TBD
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              {nextRound ? (
                canConnect ? (
                  <BracketConnector sourceMatches={revealed} />
                ) : (
                  <View style={styles.spacer} />
                )
              ) : null}
            </Fragment>
          );
        })}
        {futureRounds.length > 0 ? <BracketRoadAhead rounds={futureRounds} /> : null}
        {showTrophy ? (
          <>
            <BracketConnector sourceMatches={[lastActive.matches[0]]} />
            <BracketTrophyNode match={lastActive.matches[0]} />
          </>
        ) : null}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  skeletonWrap: {
    flexDirection: 'row',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: BottomTabInset + Spacing.lg,
  },
  skeletonColumn: {
    gap: Spacing.md,
  },
  skeletonChip: {
    width: 100,
    height: 24,
    borderRadius: Radius.full,
  },
  skeletonCard: {
    width: 224,
    height: 116,
    borderRadius: Radius.lg,
  },
  verticalScroll: {
    flex: 1,
  },
  verticalContent: {
    paddingBottom: BottomTabInset + Spacing.lg,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'flex-start',
  },
  spacer: {
    width: Spacing.xl,
  },
  column: {
    gap: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 28,
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
  },
  columnTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.6,
  },
  cards: {
    gap: Spacing.md,
  },
  tbdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    alignSelf: 'flex-start',
  },
  tbdPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
