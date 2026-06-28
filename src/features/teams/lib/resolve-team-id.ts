import { searchTeam } from '@/api/api-football-client';
import { teamNamesMatch } from '@/features/matches/lib/normalize-team-name';
import { getCachedId, setCachedId } from '@/lib/id-mapping-cache';

const NAMESPACE = 'team';

/** Resolves a worldcup26.ir team to its API-Football team id by name (no shared key between sources). */
export async function resolveTeamId(woda26TeamId: string, teamName: string, signal?: AbortSignal): Promise<number | null> {
  const cached = await getCachedId(NAMESPACE, woda26TeamId);
  if (cached !== null) return cached;

  const result = await searchTeam(teamName, signal);
  const match = result.response.find((r) => teamNamesMatch(r.team.name, teamName));
  if (!match) return null;

  await setCachedId(NAMESPACE, woda26TeamId, match.team.id);
  return match.team.id;
}
