import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { StateView } from '@/components/state-view';
import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { VenueRow } from '@/features/venues/components/venue-row';
import type { VenueSummary } from '@/features/venues/types';
import { useTheme } from '@/hooks/use-theme';

type VenueListProps = {
  venues: VenueSummary[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  refreshing: boolean;
  onRefresh: () => void;
};

export function VenueList({
  venues,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  refreshing,
  onRefresh,
}: VenueListProps) {
  const theme = useTheme();
  const renderItem = useCallback(({ item }: { item: VenueSummary }) => <VenueRow venue={item} />, []);
  const keyExtractor = useCallback((item: VenueSummary) => item.id, []);

  if (isLoading) {
    return (
      <View style={styles.content}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.skeletonRow, { backgroundColor: theme.backgroundElement }]} />
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <StateView
        icon="cloud-offline-outline"
        title="Couldn't load venues"
        description={errorMessage}
        actionLabel="Try Again"
        onAction={onRetry}
      />
    );
  }

  return (
    <FlatList
      data={venues}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <StateView icon="location-outline" title="No venues yet" description="Stadium data will appear here once available." />
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
  skeletonRow: {
    height: 64,
    borderRadius: Radius.lg,
  },
});
