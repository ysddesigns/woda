import { useQuery } from '@tanstack/react-query';

import { getStatistics, isApiFootballConfigured } from '@/api/api-football-client';
import { resolveFixtureId } from '@/features/matches/lib/resolve-fixture-id';
import { teamNamesMatch } from '@/features/matches/lib/normalize-team-name';
import type { Match } from '@/features/matches/types';
import { LIVE_STALE_TIME } from '@/lib/query-client';

export type StatRow = { label: string; home: string; away: string };

export type UseMatchStatsResult = {
  status: 'unconfigured' | 'unavailable' | 'loading' | 'error' | 'available';
  stats: StatRow[];
};

export function useMatchStats(match: Match): UseMatchStatsResult {
  const configured = isApiFootballConfigured();
  // Stats only change while the match is in progress — keep it fresh then, cache longer once final.
  const staleTime = match.status === 'live' ? LIVE_STALE_TIME : 1000 * 60 * 60 * 6;

  const query = useQuery({
    queryKey: ['match-stats', match.id],
    queryFn: async ({ signal }) => {
      const fixtureId = await resolveFixtureId(match, signal);
      if (fixtureId === null) return null;
      const response = await getStatistics(fixtureId, signal);
      return response.response;
    },
    enabled: configured,
    staleTime,
    retry: 1,
  });

  if (!configured) return { status: 'unconfigured', stats: [] };
  if (query.isLoading) return { status: 'loading', stats: [] };
  if (query.isError) return { status: 'error', stats: [] };
  if (!query.data || query.data.length < 2) return { status: 'unavailable', stats: [] };

  const homeRaw = query.data.find((s) => teamNamesMatch(s.team.name, match.home.name)) ?? query.data[0];
  const awayRaw = query.data.find((s) => teamNamesMatch(s.team.name, match.away.name)) ?? query.data[1];

  const stats = homeRaw.statistics.map((stat, i): StatRow => {
    const awayStat = awayRaw.statistics[i];
    return {
      label: stat.type,
      home: stat.value === null ? '–' : String(stat.value),
      away: awayStat?.value == null ? '–' : String(awayStat.value),
    };
  });

  return { status: 'available', stats };
}
