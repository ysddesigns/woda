import { useQuery } from '@tanstack/react-query';

import { getSquad, isApiFootballConfigured } from '@/api/api-football-client';
import { resolveTeamId } from '@/features/teams/lib/resolve-team-id';
import type { TeamSummary } from '@/features/teams/types';
import { STATIC_STALE_TIME } from '@/lib/query-client';

export type SquadPlayer = { id: number; name: string; age: number; number: number | null; position: string; photo: string };

export type UseTeamSquadResult = {
  status: 'unconfigured' | 'unavailable' | 'loading' | 'error' | 'available';
  players: SquadPlayer[];
};

export function useTeamSquad(team: TeamSummary | null): UseTeamSquadResult {
  const configured = isApiFootballConfigured();

  const query = useQuery({
    queryKey: ['team-squad', team?.id],
    queryFn: async ({ signal }) => {
      const apiTeamId = await resolveTeamId(team!.id, team!.name, signal);
      if (apiTeamId === null) return null;
      const response = await getSquad(apiTeamId, signal);
      return response.response[0]?.players ?? [];
    },
    enabled: configured && Boolean(team),
    staleTime: STATIC_STALE_TIME,
    retry: 1,
  });

  if (!configured) return { status: 'unconfigured', players: [] };
  if (query.isLoading) return { status: 'loading', players: [] };
  if (query.isError) return { status: 'error', players: [] };
  if (!query.data || query.data.length === 0) return { status: 'unavailable', players: [] };

  return { status: 'available', players: query.data };
}
