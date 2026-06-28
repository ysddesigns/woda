import { addDays, format, subDays } from 'date-fns';

import { getFixturesByTeamInRange } from '@/api/api-football-client';
import { teamNamesMatch } from '@/features/matches/lib/normalize-team-name';
import type { Match } from '@/features/matches/types';
import { resolveTeamId } from '@/features/teams/lib/resolve-team-id';
import { getCachedId, setCachedId } from '@/lib/id-mapping-cache';

const NAMESPACE = 'fixture';

/**
 * Resolves a worldcup26.ir match to its API-Football fixture id. There's no shared key
 * between the two sources, so this matches by: home team name -> API-Football team id,
 * then finds the fixture for that team in a +/-1 day window around kickoff whose opponent
 * name also matches. The window (not an exact date) absorbs the fact that worldcup26.ir's
 * kickoff time has no timezone marker, so the calendar day we compute from it can be off by
 * one relative to API-Football's own UTC-based dates for matches near midnight.
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

  const fromDate = format(subDays(match.kickoff, 1), 'yyyy-MM-dd');
  const toDate = format(addDays(match.kickoff, 1), 'yyyy-MM-dd');
  const fixtures = await getFixturesByTeamInRange(homeApiTeamId, fromDate, toDate, signal);
  const fixture = fixtures.response.find(
    (f) => teamNamesMatch(f.teams.away.name, match.away.name) || teamNamesMatch(f.teams.home.name, match.away.name),
  );
  if (!fixture) {
    if (__DEV__) {
      console.warn(
        `[resolve-fixture-id] No fixture for ${match.home.name} vs ${match.away.name} between ${fromDate} and ${toDate} — API-Football returned ${fixtures.response.length} fixture(s) for team ${homeApiTeamId} in that window.`,
      );
    }
    return null;
  }

  await setCachedId(NAMESPACE, match.id, fixture.fixture.id);
  return fixture.fixture.id;
}
