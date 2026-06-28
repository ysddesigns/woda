import { apiGet } from '@/api/client';
import type {
  ApiGame,
  ApiGroup,
  ApiStadium,
  ApiTeam,
  GamesResponse,
  GroupsResponse,
  StadiumsResponse,
  TeamsResponse,
} from '@/api/types';

export function getGames(signal?: AbortSignal): Promise<ApiGame[]> {
  return apiGet<GamesResponse>('/get/games', signal).then((r) => r.games ?? []);
}

export function getTeams(signal?: AbortSignal): Promise<ApiTeam[]> {
  return apiGet<TeamsResponse>('/get/teams', signal).then((r) => r.teams ?? []);
}

export function getStadiums(signal?: AbortSignal): Promise<ApiStadium[]> {
  return apiGet<StadiumsResponse>('/get/stadiums', signal).then((r) => r.stadiums ?? []);
}

export function getGroups(signal?: AbortSignal): Promise<ApiGroup[]> {
  return apiGet<GroupsResponse>('/get/groups', signal).then((r) => r.groups ?? []);
}

// Query keys — single source of truth for caching/invalidation.
export const queryKeys = {
  games: ['games'] as const,
  teams: ['teams'] as const,
  stadiums: ['stadiums'] as const,
  groups: ['groups'] as const,
};
