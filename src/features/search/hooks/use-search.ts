import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getGames, getStadiums, getTeams, queryKeys } from '@/api/endpoints';
import { indexById, normalizeGame } from '@/features/matches/lib/normalize';
import type { Match } from '@/features/matches/types';
import { normalizeTeam } from '@/features/teams/lib/normalize';
import type { TeamSummary } from '@/features/teams/types';
import { LIVE_STALE_TIME, STATIC_STALE_TIME } from '@/lib/query-client';
import { useFavoritesStore } from '@/store/favorites-store';

const MAX_RESULTS = 20;

export type UseSearchResult = {
  teams: TeamSummary[];
  matches: Match[];
};

/** Filters the already-cached teams/games queries (no extra network calls). */
export function useSearch(query: string): UseSearchResult {
  const teamIds = useFavoritesStore((s) => s.teamIds);
  const favoriteSet = useMemo(() => new Set(teamIds), [teamIds]);

  const games = useQuery({
    queryKey: queryKeys.games,
    queryFn: ({ signal }) => getGames(signal),
    staleTime: LIVE_STALE_TIME,
  });
  const teamsQuery = useQuery({
    queryKey: queryKeys.teams,
    queryFn: ({ signal }) => getTeams(signal),
    staleTime: STATIC_STALE_TIME,
  });
  const stadiums = useQuery({
    queryKey: queryKeys.stadiums,
    queryFn: ({ signal }) => getStadiums(signal),
    staleTime: STATIC_STALE_TIME,
  });

  return useMemo<UseSearchResult>(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return { teams: [], matches: [] };

    const teams = (teamsQuery.data ?? [])
      .filter((t) => t.name_en.toLowerCase().includes(trimmed))
      .map((t) => normalizeTeam(t, favoriteSet.has(t.id)))
      .slice(0, MAX_RESULTS);

    const teamsById = indexById(teamsQuery.data ?? []);
    const stadiumsById = indexById(stadiums.data ?? []);
    const matches = (games.data ?? [])
      .map((g) => normalizeGame(g, teamsById, stadiumsById))
      .filter((m) => m.home.name.toLowerCase().includes(trimmed) || m.away.name.toLowerCase().includes(trimmed))
      .slice(0, MAX_RESULTS);

    return { teams, matches };
  }, [query, teamsQuery.data, stadiums.data, games.data, favoriteSet]);
}
