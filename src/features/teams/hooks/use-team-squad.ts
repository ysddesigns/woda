import { useQuery } from '@tanstack/react-query';

import { apiFootballRetry, getSquad, isApiFootballConfigured } from '@/api/api-football-client';
import { useApiFootballTeamId } from '@/features/teams/hooks/use-api-football-team-id';
import type { TeamSummary } from '@/features/teams/types';
import { STATIC_STALE_TIME } from '@/lib/query-client';

export type SquadPlayer = { id: number; name: string; age: number; number: number | null; position: string; photo: string };

export type UseTeamSquadResult = {
  status: 'unconfigured' | 'unavailable' | 'loading' | 'error' | 'available';
  players: SquadPlayer[];
};

export function useTeamSquad(team: TeamSummary | null): UseTeamSquadResult {
  const configured = isApiFootballConfigured();
  const apiTeamId = useApiFootballTeamId(team);

  const query = useQuery({
    queryKey: ['team-squad', apiTeamId],
    queryFn: ({ signal }) => getSquad(apiTeamId!, signal).then((r) => r.response[0]?.players ?? []),
    enabled: configured && typeof apiTeamId === 'number',
    staleTime: STATIC_STALE_TIME,
    retry: apiFootballRetry,
  });

  if (!configured) return { status: 'unconfigured', players: [] };
  if (apiTeamId === undefined || query.isLoading) return { status: 'loading', players: [] };
  if (apiTeamId === null) return { status: 'unavailable', players: [] };
  if (query.isError) return { status: 'error', players: [] };
  if (!query.data || query.data.length === 0) return { status: 'unavailable', players: [] };

  return { status: 'available', players: query.data };
}
