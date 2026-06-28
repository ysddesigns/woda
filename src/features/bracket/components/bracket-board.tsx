import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { StateView } from '@/components/state-view';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { BracketMatchCard } from '@/features/bracket/components/bracket-match-card';
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
          <View key={i} style={[styles.skeletonCard, { backgroundColor: theme.backgroundElement }]} />
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
        title="Bracket not set yet"
        description="The knockout stage will appear here once group play determines the matchups."
      />
    );
  }

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.content}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.textSecondary} />
      }>
      {rounds.map((round) => (
        <View key={round.key} style={styles.column}>
          <Text style={[styles.columnTitle, { color: theme.textSecondary }]}>{round.label.toUpperCase()}</Text>
          <View style={styles.cards}>
            {round.matches.map((match) => (
              <BracketMatchCard key={match.id} match={match} />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  skeletonWrap: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  skeletonCard: {
    width: 220,
    height: 140,
    borderRadius: 16,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  column: {
    gap: Spacing.md,
  },
  columnTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
  },
  cards: {
    gap: Spacing.md,
  },
});
