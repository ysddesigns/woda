import { useQuery } from '@tanstack/react-query';

import { getLineups, isApiFootballConfigured } from '@/api/api-football-client';
import { useFixtureId } from '@/features/matches/hooks/use-fixture-id';
import { teamNamesMatch } from '@/features/matches/lib/normalize-team-name';
import type { Match } from '@/features/matches/types';
import { STATIC_STALE_TIME } from '@/lib/query-client';

export type LineupPlayer = { id: number; name: string; number: number; position: string | null };
export type SideLineup = { formation: string; coach: string; startXI: LineupPlayer[]; substitutes: LineupPlayer[] };
export type LineupsResult = { home: SideLineup; away: SideLineup } | null;

export type UseLineupsResult = {
  status: 'unconfigured' | 'unavailable' | 'loading' | 'error' | 'available';
  lineups: LineupsResult;
};

function toPlayer(p: { player: { id: number; name: string; number: number; pos: string | null } }): LineupPlayer {
  return { id: p.player.id, name: p.player.name, number: p.player.number, position: p.player.pos };
}

export function useLineups(match: Match): UseLineupsResult {
  const configured = isApiFootballConfigured();
  const fixtureId = useFixtureId(match);

  const query = useQuery({
    queryKey: ['lineups', fixtureId],
    queryFn: ({ signal }) => getLineups(fixtureId!, signal).then((r) => r.response),
    enabled: configured && typeof fixtureId === 'number',
    staleTime: STATIC_STALE_TIME,
    retry: 1,
  });

  if (!configured) return { status: 'unconfigured', lineups: null };
  if (fixtureId === undefined || query.isLoading) return { status: 'loading', lineups: null };
  if (fixtureId === null) return { status: 'unavailable', lineups: null };
  if (query.isError) return { status: 'error', lineups: null };
  if (!query.data || query.data.length < 2) return { status: 'unavailable', lineups: null };

  const homeRaw = query.data.find((l) => teamNamesMatch(l.team.name, match.home.name)) ?? query.data[0];
  const awayRaw = query.data.find((l) => teamNamesMatch(l.team.name, match.away.name)) ?? query.data[1];

  return {
    status: 'available',
    lineups: {
      home: {
        formation: homeRaw.formation,
        coach: homeRaw.coach.name,
        startXI: homeRaw.startXI.map(toPlayer),
        substitutes: homeRaw.substitutes.map(toPlayer),
      },
      away: {
        formation: awayRaw.formation,
        coach: awayRaw.coach.name,
        startXI: awayRaw.startXI.map(toPlayer),
        substitutes: awayRaw.substitutes.map(toPlayer),
      },
    },
  };
}
