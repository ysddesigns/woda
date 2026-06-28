import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { StateView } from '@/components/state-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { MatchCard } from '@/features/matches/components/match-card';
import { MatchCardSkeleton } from '@/features/matches/components/match-card-skeleton';
import type { Match, MatchBucket } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';

const EMPTY_COPY: Record<MatchBucket, { emoji: string; title: string; description: string }> = {
  past: { emoji: '🏁', title: 'No past matches', description: 'Completed matches will show up here.' },
  today: { emoji: '📅', title: 'No matches today', description: 'Check Upcoming for the next fixtures.' },
  upcoming: { emoji: '⏳', title: 'No upcoming matches', description: "You're all caught up." },
};

type MatchListProps = {
  bucket: MatchBucket;
  matches: Match[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  refreshing: boolean;
  onRefresh: () => void;
};

export function MatchList({
  bucket,
  matches,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  refreshing,
  onRefresh,
}: MatchListProps) {
  const theme = useTheme();
  const renderItem = useCallback(({ item }: { item: Match }) => <MatchCard match={item} />, []);
  const keyExtractor = useCallback((item: Match) => item.id, []);

  if (isLoading) {
    return (
      <View style={styles.skeletonWrap}>
        {Array.from({ length: 6 }).map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <StateView
        emoji="😕"
        title="Couldn't load matches"
        description={errorMessage}
        actionLabel="Try Again"
        onAction={onRetry}
      />
    );
  }

  const empty = EMPTY_COPY[bucket];
  return (
    <FlatList
      data={matches}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, matches.length === 0 && styles.contentEmpty]}
      ListEmptyComponent={<StateView emoji={empty.emoji} title={empty.title} description={empty.description} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.textSecondary} />
      }
    />
  );
}

const styles = StyleSheet.create({
  skeletonWrap: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: BottomTabInset + Spacing.lg,
    gap: Spacing.md,
  },
  contentEmpty: {
    flexGrow: 1,
  },
});
