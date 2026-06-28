import { useQuery } from '@tanstack/react-query';

import { apiFootballRetry, getEvents, isApiFootballConfigured } from '@/api/api-football-client';
import { useFixtureId } from '@/features/matches/hooks/use-fixture-id';
import { teamNamesMatch } from '@/features/matches/lib/normalize-team-name';
import type { Match } from '@/features/matches/types';
import { LIVE_STALE_TIME } from '@/lib/query-client';

export type MatchEvent =
  | { kind: 'card'; side: 'home' | 'away'; minute: number; player: string; card: 'yellow' | 'red' }
  | { kind: 'substitution'; side: 'home' | 'away'; minute: number; playerOut: string; playerIn: string }
  | { kind: 'var'; side: 'home' | 'away'; minute: number; detail: string };

export type UseMatchEventsResult = {
  status: 'unconfigured' | 'unavailable' | 'loading' | 'error' | 'available';
  events: MatchEvent[];
};

/** Cards, substitutions, and VAR reviews only — goals already come from worldcup26.ir scorer data. */
export function useMatchEvents(match: Match): UseMatchEventsResult {
  const configured = isApiFootballConfigured();
  const fixtureId = useFixtureId(match);
  const staleTime = match.status === 'live' ? LIVE_STALE_TIME : 1000 * 60 * 60 * 6;

  const query = useQuery({
    queryKey: ['match-events', fixtureId],
    queryFn: ({ signal }) => getEvents(fixtureId!, signal).then((r) => r.response),
    enabled: configured && typeof fixtureId === 'number',
    staleTime,
    retry: apiFootballRetry,
  });

  if (!configured) return { status: 'unconfigured', events: [] };
  if (fixtureId === undefined || query.isLoading) return { status: 'loading', events: [] };
  if (fixtureId === null) return { status: 'unavailable', events: [] };
  if (query.isError) return { status: 'error', events: [] };
  if (!query.data) return { status: 'unavailable', events: [] };

  const events: MatchEvent[] = [];
  for (const raw of query.data) {
    const side: 'home' | 'away' = teamNamesMatch(raw.team.name, match.home.name) ? 'home' : 'away';
    const minute = raw.time.elapsed + (raw.time.extra ?? 0);

    if (raw.type === 'Card') {
      events.push({
        kind: 'card',
        side,
        minute,
        player: raw.player.name,
        card: raw.detail.toLowerCase().includes('red') ? 'red' : 'yellow',
      });
    } else if (raw.type === 'subst') {
      events.push({
        kind: 'substitution',
        side,
        minute,
        playerOut: raw.player.name,
        playerIn: raw.assist.name ?? 'Unknown',
      });
    } else if (raw.type === 'Var') {
      events.push({ kind: 'var', side, minute, detail: raw.detail });
    }
  }

  return { status: events.length > 0 ? 'available' : 'unavailable', events: events.sort((a, b) => a.minute - b.minute) };
}
