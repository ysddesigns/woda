import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getGroups, getTeams, queryKeys } from '@/api/endpoints';
import { indexById } from '@/features/matches/lib/normalize';
import { normalizeGroup } from '@/features/standings/lib/normalize';
import type { StandingsGroup } from '@/features/standings/types';
import { LIVE_STALE_TIME, STATIC_STALE_TIME } from '@/lib/query-client';

export type UseStandingsResult = {
  groups: StandingsGroup[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  isRefetching: boolean;
};

/** Fetches group standings + teams (for name/flag lookup), then normalizes + sorts each group. */
export function useStandings(): UseStandingsResult {
  const groupsQuery = useQuery({
    queryKey: queryKeys.groups,
    queryFn: ({ signal }) => getGroups(signal),
    staleTime: LIVE_STALE_TIME,
    refetchInterval: LIVE_STALE_TIME,
  });
  const teamsQuery = useQuery({
    queryKey: queryKeys.teams,
    queryFn: ({ signal }) => getTeams(signal),
    staleTime: STATIC_STALE_TIME,
  });

  const groups = useMemo<StandingsGroup[]>(() => {
    if (!groupsQuery.data) return [];
    const teamsById = indexById(teamsQuery.data ?? []);
    return groupsQuery.data
      .map((g) => normalizeGroup(g, teamsById))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [groupsQuery.data, teamsQuery.data]);

  return {
    groups,
    isLoading: groupsQuery.isLoading,
    isError: groupsQuery.isError,
    error: groupsQuery.error,
    refetch: () => {
      groupsQuery.refetch();
      teamsQuery.refetch();
    },
    isRefetching: groupsQuery.isRefetching,
  };
}
