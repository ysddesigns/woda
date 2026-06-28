/**
 * Minimal typed wrapper for API-Football v3 (api-sports.io) — Phase 2 enrichment for
 * lineups, match stats, events (cards/VAR/subs), squads, and coaches. The base
 * worldcup26.ir API doesn't provide any of this.
 *
 * Ships the API key inside the client bundle (EXPO_PUBLIC_*) — there's no backend to proxy
 * through. Acceptable for this consumer-tier free API; revisit if a backend is ever added.
 * Every caller must treat failures (missing key, quota, network) as "enrichment unavailable"
 * and fall back gracefully — never block core match/team rendering on this API.
 */

import type {
  AfCoachResponse,
  AfFixturesResponse,
  AfLineupsResponse,
  AfSquadResponse,
  AfStatisticsResponse,
  AfTeamSearchResponse,
  AfEventsResponse,
} from '@/api/api-football-types';

const BASE_URL = 'https://v3.football.api-sports.io';

export class ApiFootballError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiFootballError';
  }
}

/**
 * TanStack Query `retry` option for API-Football queries. A 429 (per-minute rate limit) won't
 * clear within a quick retry — retrying immediately just adds to the burst that caused it — so
 * don't. Anything else gets one retry, same as the previous flat `retry: 1` everywhere.
 */
export function apiFootballRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiFootballError && error.status === 429) return false;
  return failureCount < 1;
}

let warnedMissingKey = false;

export function isApiFootballConfigured(): boolean {
  const configured = Boolean(process.env.EXPO_PUBLIC_API_FOOTBALL_KEY);
  if (!configured && __DEV__ && !warnedMissingKey) {
    warnedMissingKey = true;
    console.warn(
      '[api-football] EXPO_PUBLIC_API_FOOTBALL_KEY is not set in this build — lineups/stats/events/roster/coach will stay in their "not available" state. Local dev: add it to .env and restart Metro with --clear. EAS builds: register it with `eas env:create`.',
    );
  }
  return configured;
}

async function afGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const key = process.env.EXPO_PUBLIC_API_FOOTBALL_KEY;
  if (!key) throw new ApiFootballError('API-Football key not configured', 0);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'x-apisports-key': key },
      signal,
    });
  } catch {
    throw new ApiFootballError('Network error reaching API-Football', 0);
  }

  if (!response.ok) {
    if (__DEV__) {
      const body = await response.text().catch(() => '');
      console.warn(`[api-football] ${path} -> ${response.status}: ${body.slice(0, 300)}`);
    }
    throw new ApiFootballError(`API-Football request failed (${response.status})`, response.status);
  }

  return (await response.json()) as T;
}

export function searchTeam(name: string, signal?: AbortSignal): Promise<AfTeamSearchResponse> {
  return afGet(`/teams?search=${encodeURIComponent(name)}`, signal);
}

/**
 * Filters by a date range rather than a single exact date — worldcup26.ir's kickoff time has
 * no timezone marker, so the calendar day we compute from it can land a day off from
 * API-Football's own UTC-based date filtering for matches near midnight. A range absorbs that.
 */
export function getFixturesByTeamInRange(
  apiTeamId: number,
  fromIsoDate: string,
  toIsoDate: string,
  signal?: AbortSignal,
): Promise<AfFixturesResponse> {
  return afGet(`/fixtures?team=${apiTeamId}&from=${fromIsoDate}&to=${toIsoDate}`, signal);
}

export function getLineups(fixtureId: number, signal?: AbortSignal): Promise<AfLineupsResponse> {
  return afGet(`/fixtures/lineups?fixture=${fixtureId}`, signal);
}

export function getStatistics(fixtureId: number, signal?: AbortSignal): Promise<AfStatisticsResponse> {
  return afGet(`/fixtures/statistics?fixture=${fixtureId}`, signal);
}

export function getEvents(fixtureId: number, signal?: AbortSignal): Promise<AfEventsResponse> {
  return afGet(`/fixtures/events?fixture=${fixtureId}`, signal);
}

export function getSquad(apiTeamId: number, signal?: AbortSignal): Promise<AfSquadResponse> {
  return afGet(`/players/squads?team=${apiTeamId}`, signal);
}

export function getCoach(apiTeamId: number, signal?: AbortSignal): Promise<AfCoachResponse> {
  return afGet(`/coachs?team=${apiTeamId}`, signal);
}
