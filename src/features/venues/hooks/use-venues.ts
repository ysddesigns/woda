import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getStadiums, queryKeys } from '@/api/endpoints';
import { normalizeVenue } from '@/features/venues/lib/normalize';
import type { VenueSummary } from '@/features/venues/types';
import { STATIC_STALE_TIME } from '@/lib/query-client';

export type UseVenuesResult = {
  venues: VenueSummary[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  isRefetching: boolean;
};

export function useVenues(): UseVenuesResult {
  const query = useQuery({
    queryKey: queryKeys.stadiums,
    queryFn: ({ signal }) => getStadiums(signal),
    staleTime: STATIC_STALE_TIME,
  });

  const venues = useMemo<VenueSummary[]>(() => {
    if (!query.data) return [];
    return query.data
      .map(normalizeVenue)
      .sort((a, b) => a.region.localeCompare(b.region) || a.name.localeCompare(b.name));
  }, [query.data]);

  return {
    venues,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: () => query.refetch(),
    isRefetching: query.isRefetching,
  };
}
