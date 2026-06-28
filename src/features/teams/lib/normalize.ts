import type { ApiTeam } from '@/api/types';
import type { TeamSummary } from '@/features/teams/types';

export function normalizeTeam(team: ApiTeam, isFavorite: boolean): TeamSummary {
  return {
    id: team.id,
    name: team.name_en,
    flag: team.flag,
    fifaCode: team.fifa_code,
    group: team.groups,
    isFavorite,
  };
}
