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

export function isApiFootballConfigured(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_API_FOOTBALL_KEY);
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
    throw new ApiFootballError(`API-Football request failed (${response.status})`, response.status);
  }

  return (await response.json()) as T;
}

export function searchTeam(name: string, signal?: AbortSignal): Promise<AfTeamSearchResponse> {
  return afGet(`/teams?search=${encodeURIComponent(name)}`, signal);
}

export function getFixturesByTeamAndDate(
  apiTeamId: number,
  isoDate: string,
  signal?: AbortSignal,
): Promise<AfFixturesResponse> {
  return afGet(`/fixtures?team=${apiTeamId}&date=${isoDate}`, signal);
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
