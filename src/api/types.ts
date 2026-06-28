/**
 * Raw response shapes from the worldcup26.ir REST API.
 * Note: the API returns most numeric fields as strings and booleans as "TRUE"/"FALSE".
 * These are the wire types — parsing/normalization happens in the matches feature layer.
 */

export type ApiTeam = {
  id: string;
  name_en: string;
  name_fa: string;
  flag: string; // full URL (flagcdn.com)
  fifa_code: string;
  iso2: string;
  groups: string; // single group letter, e.g. "A"
};

export type ApiGame = {
  id: string;
  home_team_id: string; // "0" when undetermined (knockout placeholder)
  away_team_id: string;
  home_score: string;
  away_score: string;
  home_scorers: string; // stringified array or "null"
  away_scorers: string;
  group: string; // "A".."L" | "R32" | "R16" | "QF" | "SF" | "F"
  matchday: string;
  local_date: string; // "MM/dd/yyyy HH:mm"
  persian_date: string;
  stadium_id: string;
  finished: 'TRUE' | 'FALSE';
  time_elapsed: string; // "finished" | "notstarted" | live minute e.g. "57"
  type: string; // "group" | "r32" | "r16" | "qf" | "sf" | "f"
  home_team_name_en?: string;
  home_team_name_fa?: string;
  away_team_name_en?: string;
  away_team_name_fa?: string;
  home_team_label?: string; // e.g. "Winner Group J" when team is TBD
  away_team_label?: string;
};

export type ApiStadium = {
  id: string;
  name_en: string;
  name_fa: string;
  fifa_name: string;
  city_en: string;
  city_fa: string;
  country_en: string;
  country_fa: string;
  capacity: number;
  region: string;
};

export type ApiGroupStanding = {
  team_id: string;
  mp: string;
  w: string;
  l: string;
  d: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
};

export type ApiGroup = {
  _id: string;
  name: string;
  teams: ApiGroupStanding[];
};

// Endpoint envelopes
export type GamesResponse = { games: ApiGame[] };
export type TeamsResponse = { teams: ApiTeam[] };
export type StadiumsResponse = { stadiums: ApiStadium[] };
export type GroupsResponse = { groups: ApiGroup[] };
