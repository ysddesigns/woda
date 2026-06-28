import { ApiError } from '@/api/client';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing, FontSize } from '@/constants/theme';
import { MatchesHeader } from '@/features/matches/components/matches-header';
import { MatchFilterBar } from '@/features/matches/components/match-filter-bar';
import { MatchList } from '@/features/matches/components/match-list';
import { SegmentedFilter } from '@/features/matches/components/segmented-filter';
import { useFavoriteMatchReminders } from '@/features/matches/hooks/use-favorite-match-reminders';
import { useMatches } from '@/features/matches/hooks/use-matches';
import { filterMatches, type MatchFilters } from '@/features/matches/lib/group-by-date';
import type { MatchBucket } from '@/features/matches/types';
import { SearchModal } from '@/features/search/components/search-modal';
import { useTheme } from '@/hooks/use-theme';
import { isEnabled } from '@/lib/feature-flags';

const NO_FILTERS: MatchFilters = { group: null, stadium: null };

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.isNetwork) {
    return 'Check your internet connection and try again.';
  }
  return 'We couldn’t reach the scores service. Please try again.';
}

export default function MatchesScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [bucket, setBucket] = useState<MatchBucket>('today');
  const [filters, setFilters] = useState<MatchFilters>(NO_FILTERS);
  const [searchOpen, setSearchOpen] = useState(false);
  const { matches, buckets, isLoading, isError, error, refetch, isRefetching, lastUpdated } = useMatches();
  useFavoriteMatchReminders(matches);

  const groups = useMemo(
    () => Array.from(new Set(matches.map((m) => m.group).filter(Boolean))).sort(),
    [matches],
  );
  const stadiums = useMemo(
    () => Array.from(new Set(matches.map((m) => m.venue?.name).filter((v): v is string => Boolean(v)))).sort(),
    [matches],
  );
  const filteredMatches = useMemo(() => filterMatches(buckets[bucket], filters), [buckets, bucket, filters]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]} collapsable={false}>
      <View style={{ paddingTop: insets.top }}>
        <MatchesHeader onSearchPress={isEnabled('search') ? () => setSearchOpen(true) : undefined} />
      </View>

      <View style={styles.controls}>
        <SegmentedFilter value={bucket} onChange={setBucket} />
        <MatchFilterBar groups={groups} stadiums={stadiums} filters={filters} onChange={setFilters} />
        {lastUpdated && !isLoading && !isError ? (
          <Text style={[styles.timestamp, { color: theme.textHint }]}>
            Updated {format(lastUpdated, 'HH:mm')} · Data: worldcup26.ir
          </Text>
        ) : null}
      </View>

      <MatchList
        bucket={bucket}
        matches={filteredMatches}
        filtersActive={filters.group !== null || filters.stadium !== null}
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage(error)}
        onRetry={refetch}
        refreshing={isRefetching}
        onRefresh={refetch}
      />

      <SearchModal visible={searchOpen} onClose={() => setSearchOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  controls: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  timestamp: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    paddingTop: Spacing.sm,
  },
});
