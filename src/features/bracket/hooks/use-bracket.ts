import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getGames, getStadiums, getTeams, queryKeys } from '@/api/endpoints';
import type { BracketRound } from '@/features/bracket/lib/group-rounds';
import { groupByRound } from '@/features/bracket/lib/group-rounds';
import { indexById, normalizeGame } from '@/features/matches/lib/normalize';
import { LIVE_STALE_TIME, STATIC_STALE_TIME } from '@/lib/query-client';

export type UseBracketResult = {
  rounds: BracketRound[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  isRefetching: boolean;
};

/** Reuses the games/teams/stadiums queries already populated by useMatches (cache-shared). */
export function useBracket(): UseBracketResult {
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

  const rounds = useMemo<BracketRound[]>(() => {
    if (!games.data) return [];
    const teamsById = indexById(teams.data ?? []);
    const stadiumsById = indexById(stadiums.data ?? []);
    const matches = games.data.map((g) => normalizeGame(g, teamsById, stadiumsById));
    return groupByRound(matches);
  }, [games.data, teams.data, stadiums.data]);

  return {
    rounds,
    isLoading: games.isLoading,
    isError: games.isError,
    error: games.error,
    refetch: () => {
      games.refetch();
      teams.refetch();
      stadiums.refetch();
    },
    isRefetching: games.isRefetching,
  };
}
