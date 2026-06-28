import { useQuery } from '@tanstack/react-query';

import { apiFootballRetry, isApiFootballConfigured } from '@/api/api-football-client';
import { resolveTeamId } from '@/features/teams/lib/resolve-team-id';
import type { TeamSummary } from '@/features/teams/types';
import { STATIC_STALE_TIME } from '@/lib/query-client';

/** Resolves (and caches) a team's API-Football id once, shared by useTeamSquad/useTeamCoach. */
export function useApiFootballTeamId(team: TeamSummary | null): number | null | undefined {
  const configured = isApiFootballConfigured();

  const query = useQuery({
    queryKey: ['af-team-id', team?.id],
    queryFn: ({ signal }) => resolveTeamId(team!.id, team!.name, signal),
    enabled: configured && Boolean(team),
    staleTime: STATIC_STALE_TIME,
    retry: apiFootballRetry,
  });

  return configured && team ? query.data : null;
}
