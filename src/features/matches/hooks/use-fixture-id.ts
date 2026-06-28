import { useQuery } from '@tanstack/react-query';

import { isApiFootballConfigured } from '@/api/api-football-client';
import { resolveFixtureId } from '@/features/matches/lib/resolve-fixture-id';
import type { Match } from '@/features/matches/types';
import { STATIC_STALE_TIME } from '@/lib/query-client';

/**
 * Resolves (and caches) a match's API-Football fixture id once per match, shared by
 * useLineups/useMatchStats/useMatchEvents — without this, each of those three hooks would
 * independently re-run the same name/date lookup, tripling API calls (and quota burn) per
 * screen, especially painful when the lookup keeps failing on a quota- or plan-restricted key.
 */
export function useFixtureId(match: Match): number | null | undefined {
  const configured = isApiFootballConfigured();

  const query = useQuery({
    queryKey: ['fixture-id', match.id],
    queryFn: ({ signal }) => resolveFixtureId(match, signal),
    enabled: configured,
    staleTime: STATIC_STALE_TIME,
    retry: 1,
  });

  // undefined = still resolving, null = resolved but no match found, number = resolved fixture id.
  return configured ? query.data : null;
}
