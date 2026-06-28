import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { StateView } from '@/components/state-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { TeamRow } from '@/features/teams/components/team-row';
import { TeamRowSkeleton } from '@/features/teams/components/team-row-skeleton';
import type { TeamSummary } from '@/features/teams/types';
import { useTheme } from '@/hooks/use-theme';

type TeamListProps = {
  teams: TeamSummary[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  refreshing: boolean;
  onRefresh: () => void;
};

export function TeamList({ teams, isLoading, isError, errorMessage, onRetry, refreshing, onRefresh }: TeamListProps) {
  const theme = useTheme();
  const renderItem = useCallback(({ item }: { item: TeamSummary }) => <TeamRow team={item} />, []);
  const keyExtractor = useCallback((item: TeamSummary) => item.id, []);

  if (isLoading) {
    return (
      <View style={styles.content}>
        {Array.from({ length: 8 }).map((_, i) => (
          <TeamRowSkeleton key={i} />
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <StateView
        icon="cloud-offline-outline"
        title="Couldn't load teams"
        description={errorMessage}
        actionLabel="Try Again"
        onAction={onRetry}
      />
    );
  }

  return (
    <FlatList
      data={teams}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <StateView icon="people-outline" title="No teams yet" description="Team data will appear here once available." />
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.textSecondary} />
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: BottomTabInset + Spacing.lg,
    gap: Spacing.sm,
  },
});
