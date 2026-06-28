import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { StateView } from '@/components/state-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { StandingsTable } from '@/features/standings/components/standings-table';
import { StandingsTableSkeleton } from '@/features/standings/components/standings-table-skeleton';
import type { StandingsGroup } from '@/features/standings/types';
import { useTheme } from '@/hooks/use-theme';

type StandingsListProps = {
  groups: StandingsGroup[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  refreshing: boolean;
  onRefresh: () => void;
};

export function StandingsList({
  groups,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  refreshing,
  onRefresh,
}: StandingsListProps) {
  const theme = useTheme();
  const renderItem = useCallback(({ item }: { item: StandingsGroup }) => <StandingsTable group={item} />, []);
  const keyExtractor = useCallback((item: StandingsGroup) => item.name, []);

  if (isLoading) {
    return (
      <View style={styles.skeletonWrap}>
        {Array.from({ length: 4 }).map((_, i) => (
          <StandingsTableSkeleton key={i} />
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <StateView
        icon="cloud-offline-outline"
        title="Couldn't load standings"
        description={errorMessage}
        actionLabel="Try Again"
        onAction={onRetry}
      />
    );
  }

  return (
    <FlatList
      data={groups}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, groups.length === 0 && styles.contentEmpty]}
      ListEmptyComponent={
        <StateView
          icon="trophy-outline"
          title="No standings yet"
          description="Group tables will appear here once matches have been played."
        />
      }
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
