import { useQuery } from '@tanstack/react-query';

import { getCoach, isApiFootballConfigured } from '@/api/api-football-client';
import { resolveTeamId } from '@/features/teams/lib/resolve-team-id';
import type { TeamSummary } from '@/features/teams/types';
import { STATIC_STALE_TIME } from '@/lib/query-client';

export type Coach = { id: number; name: string; photo: string };

export type UseTeamCoachResult = {
  status: 'unconfigured' | 'unavailable' | 'loading' | 'error' | 'available';
  coach: Coach | null;
};

export function useTeamCoach(team: TeamSummary | null): UseTeamCoachResult {
  const configured = isApiFootballConfigured();

  const query = useQuery({
    queryKey: ['team-coach', team?.id],
    queryFn: async ({ signal }) => {
      const apiTeamId = await resolveTeamId(team!.id, team!.name, signal);
      if (apiTeamId === null) return null;
      const response = await getCoach(apiTeamId, signal);
      return response.response[0] ?? null;
    },
    enabled: configured && Boolean(team),
    staleTime: STATIC_STALE_TIME,
    retry: 1,
  });

  if (!configured) return { status: 'unconfigured', coach: null };
  if (query.isLoading) return { status: 'loading', coach: null };
  if (query.isError) return { status: 'error', coach: null };
  if (!query.data) return { status: 'unavailable', coach: null };

  return { status: 'available', coach: query.data };
}
