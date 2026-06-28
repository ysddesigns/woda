import { useQuery } from '@tanstack/react-query';

import { apiFootballRetry, getCoach, isApiFootballConfigured } from '@/api/api-football-client';
import { useApiFootballTeamId } from '@/features/teams/hooks/use-api-football-team-id';
import type { TeamSummary } from '@/features/teams/types';
import { STATIC_STALE_TIME } from '@/lib/query-client';

export type Coach = { id: number; name: string; photo: string };

export type UseTeamCoachResult = {
  status: 'unconfigured' | 'unavailable' | 'loading' | 'error' | 'available';
  coach: Coach | null;
};

export function useTeamCoach(team: TeamSummary | null): UseTeamCoachResult {
  const configured = isApiFootballConfigured();
  const apiTeamId = useApiFootballTeamId(team);

  const query = useQuery({
    queryKey: ['team-coach', apiTeamId],
    queryFn: ({ signal }) => getCoach(apiTeamId!, signal).then((r) => r.response[0] ?? null),
    enabled: configured && typeof apiTeamId === 'number',
    staleTime: STATIC_STALE_TIME,
    retry: apiFootballRetry,
  });

  if (!configured) return { status: 'unconfigured', coach: null };
  if (apiTeamId === undefined || query.isLoading) return { status: 'loading', coach: null };
  if (apiTeamId === null) return { status: 'unavailable', coach: null };
  if (query.isError) return { status: 'error', coach: null };
  if (!query.data) return { status: 'unavailable', coach: null };

  return { status: 'available', coach: query.data };
}
