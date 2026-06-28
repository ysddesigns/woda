import { ApiError } from '@/api/client';
import { format } from 'date-fns';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Spacing, FontSize } from '@/constants/theme';
import { MatchList } from '@/features/matches/components/match-list';
import { SegmentedFilter } from '@/features/matches/components/segmented-filter';
import { useMatches } from '@/features/matches/hooks/use-matches';
import type { MatchBucket } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.isNetwork) {
    return 'Check your internet connection and try again.';
  }
  return 'We couldn’t reach the scores service. Please try again.';
}

export default function MatchesScreen() {
  const theme = useTheme();
  const [bucket, setBucket] = useState<MatchBucket>('today');
  const { buckets, isLoading, isError, error, refetch, isRefetching, lastUpdated } = useMatches();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]} collapsable={false}>
      <View style={styles.controls}>
        <SegmentedFilter value={bucket} onChange={setBucket} />
        {lastUpdated && !isLoading && !isError ? (
          <Text style={[styles.timestamp, { color: theme.textHint }]}>
            Updated {format(lastUpdated, 'HH:mm')} · Data: worldcup26.ir
          </Text>
        ) : null}
      </View>

      <MatchList
        bucket={bucket}
        matches={buckets[bucket]}
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage(error)}
        onRetry={refetch}
        refreshing={isRefetching}
        onRefresh={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  controls: {
    paddingTop: Spacing.md,
  },
  timestamp: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
});
