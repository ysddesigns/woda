import type { ApiGroup, ApiTeam } from '@/api/types';
import type { StandingRow, StandingsGroup } from '@/features/standings/types';

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function normalizeGroup(group: ApiGroup, teamsById: Map<string, ApiTeam>): StandingsGroup {
  const rows: StandingRow[] = group.teams.map((standing) => {
    const team = teamsById.get(standing.team_id);
    const goalsFor = toNumber(standing.gf);
    const goalsAgainst = toNumber(standing.ga);
    return {
      team: {
        id: standing.team_id,
        name: team?.name_en ?? 'TBD',
        flag: team?.flag,
        fifaCode: team?.fifa_code,
      },
      played: toNumber(standing.mp),
      won: toNumber(standing.w),
      drawn: toNumber(standing.d),
      lost: toNumber(standing.l),
      goalsFor,
      goalsAgainst,
      goalDiff: toNumber(standing.gd),
      points: toNumber(standing.pts),
    };
  });

  rows.sort(
    (a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor,
  );

  return { name: group.name, rows };
}
