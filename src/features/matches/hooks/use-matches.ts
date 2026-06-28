import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getGames, getStadiums, getTeams, queryKeys } from '@/api/endpoints';
import { groupByBucket } from '@/features/matches/lib/group-by-date';
import { indexById, normalizeGame } from '@/features/matches/lib/normalize';
import type { Match, MatchBucket } from '@/features/matches/types';
import { LIVE_STALE_TIME, STATIC_STALE_TIME } from '@/lib/query-client';

export type UseMatchesResult = {
  buckets: Record<MatchBucket, Match[]>;
  allById: Map<string, Match>;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  isRefetching: boolean;
  lastUpdated: number | null;
};

/**
 * Fetches games (live-refreshing), teams, and stadiums, then normalizes + buckets them.
 * Teams/stadiums are effectively static and cached long; games refetch on an interval so
 * live scores stay current while the screen is open.
 */
export function useMatches(): UseMatchesResult {
  const games = useQuery({
    queryKey: queryKeys.games,
    queryFn: ({ signal }) => getGames(signal),
    staleTime: LIVE_STALE_TIME,
    refetchInterval: LIVE_STALE_TIME,
  });
  const teams = useQuery({
    queryKey: queryKeys.teams,
    queryFn: ({ signal }) => getTeams(signal),
    staleTime: STATIC_STALE_TIME,
  });
  const stadiums = useQuery({
    queryKey: queryKeys.stadiums,
    queryFn: ({ signal }) => getStadiums(signal),
    staleTime: STATIC_STALE_TIME,
  });

  const matches = useMemo<Match[]>(() => {
    if (!games.data) return [];
    const teamsById = indexById(teams.data ?? []);
    const stadiumsById = indexById(stadiums.data ?? []);
    return games.data.map((g) => normalizeGame(g, teamsById, stadiumsById));
  }, [games.data, teams.data, stadiums.data]);

  const buckets = useMemo(() => groupByBucket(matches), [matches]);
  const allById = useMemo(() => new Map(matches.map((m) => [m.id, m])), [matches]);

  return {
    buckets,
    allById,
    // Reference data missing shouldn't block the screen — games drive loading/error.
    isLoading: games.isLoading,
    isError: games.isError,
    error: games.error,
    refetch: () => {
      games.refetch();
      teams.refetch();
      stadiums.refetch();
    },
    isRefetching: games.isRefetching,
    lastUpdated: games.dataUpdatedAt || null,
  };
}
