import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getTeams, queryKeys } from '@/api/endpoints';
import { normalizeTeam } from '@/features/teams/lib/normalize';
import type { TeamSummary } from '@/features/teams/types';
import { STATIC_STALE_TIME } from '@/lib/query-client';
import { useFavoritesStore } from '@/store/favorites-store';

export type UseTeamsResult = {
  teams: TeamSummary[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  isRefetching: boolean;
};

export function useTeams(): UseTeamsResult {
  const teamIds = useFavoritesStore((s) => s.teamIds);
  const favoriteSet = useMemo(() => new Set(teamIds), [teamIds]);

  const query = useQuery({
    queryKey: queryKeys.teams,
    queryFn: ({ signal }) => getTeams(signal),
    staleTime: STATIC_STALE_TIME,
  });

  const teams = useMemo<TeamSummary[]>(() => {
    if (!query.data) return [];
    return query.data
      .map((t) => normalizeTeam(t, favoriteSet.has(t.id)))
      .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
  }, [query.data, favoriteSet]);

  return {
    teams,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: () => query.refetch(),
    isRefetching: query.isRefetching,
  };
}
