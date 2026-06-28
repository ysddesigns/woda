import { format } from 'date-fns';

import { getFixturesByTeamAndDate } from '@/api/api-football-client';
import { teamNamesMatch } from '@/features/matches/lib/normalize-team-name';
import type { Match } from '@/features/matches/types';
import { resolveTeamId } from '@/features/teams/lib/resolve-team-id';
import { getCachedId, setCachedId } from '@/lib/id-mapping-cache';

const NAMESPACE = 'fixture';

/**
 * Resolves a worldcup26.ir match to its API-Football fixture id. There's no shared key
 * between the two sources, so this matches by: home team name -> API-Football team id,
 * then finds the fixture on that team's kickoff date whose opponent name also matches.
 * Returns null (not a throw) when resolution fails — callers should render the existing
 * "not available" empty state rather than an error.
 */
export async function resolveFixtureId(match: Match, signal?: AbortSignal): Promise<number | null> {
  const cached = await getCachedId(NAMESPACE, match.id);
  if (cached !== null) return cached;

  if (Number.isNaN(match.kickoff.getTime()) || match.home.isPlaceholder || match.away.isPlaceholder) {
    return null;
  }

  const homeApiTeamId = await resolveTeamId(match.home.id, match.home.name, signal);
  if (homeApiTeamId === null) return null;

  const isoDate = format(match.kickoff, 'yyyy-MM-dd');
  const fixtures = await getFixturesByTeamAndDate(homeApiTeamId, isoDate, signal);
  const fixture = fixtures.response.find(
    (f) => teamNamesMatch(f.teams.away.name, match.away.name) || teamNamesMatch(f.teams.home.name, match.away.name),
  );
  if (!fixture) return null;

  await setCachedId(NAMESPACE, match.id, fixture.fixture.id);
  return fixture.fixture.id;
}
