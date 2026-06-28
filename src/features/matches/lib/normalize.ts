import { parse } from 'date-fns';

import type { ApiGame, ApiStadium, ApiTeam } from '@/api/types';
import { parseScorers } from '@/features/matches/lib/parse-scorers';
import type { Match, MatchStatus, MatchTeam } from '@/features/matches/types';

const DATE_FORMAT = 'MM/dd/yyyy HH:mm';

function parseKickoff(local_date: string): Date {
  const parsed = parse(local_date, DATE_FORMAT, new Date());
  return Number.isNaN(parsed.getTime()) ? new Date(NaN) : parsed;
}

function deriveStatus(game: ApiGame): MatchStatus {
  if (game.finished === 'TRUE') return 'finished';
  if (game.time_elapsed === 'notstarted' || !game.time_elapsed) return 'upcoming';
  return 'live';
}

function parseScore(value: string): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function buildTeam(
  id: string,
  nameEn: string | undefined,
  label: string | undefined,
  teamsById: Map<string, ApiTeam>,
): MatchTeam {
  const isPlaceholder = !id || id === '0';
  const team = teamsById.get(id);
  return {
    id,
    name: nameEn || team?.name_en || label || 'TBD',
    flag: isPlaceholder ? undefined : team?.flag,
    fifaCode: team?.fifa_code,
    isPlaceholder,
  };
}

export function normalizeGame(
  game: ApiGame,
  teamsById: Map<string, ApiTeam>,
  stadiumsById: Map<string, ApiStadium>,
): Match {
  const status = deriveStatus(game);
  const stadium = stadiumsById.get(game.stadium_id);

  return {
    id: game.id,
    home: buildTeam(game.home_team_id, game.home_team_name_en, game.home_team_label, teamsById),
    away: buildTeam(game.away_team_id, game.away_team_name_en, game.away_team_label, teamsById),
    homeScore: status === 'upcoming' ? null : parseScore(game.home_score),
    awayScore: status === 'upcoming' ? null : parseScore(game.away_score),
    status,
    kickoff: parseKickoff(game.local_date),
    minute: status === 'live' ? game.time_elapsed : null,
    group: game.group,
    stage: game.type,
    matchday: game.matchday,
    venue: stadium
      ? { name: stadium.fifa_name || stadium.name_en, city: stadium.city_en, capacity: stadium.capacity }
      : undefined,
    homeScorers: parseScorers(game.home_scorers),
    awayScorers: parseScorers(game.away_scorers),
  };
}

export function indexById<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}
