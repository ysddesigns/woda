/** Response shapes from the API-Football v3 REST API (api-sports.io) — Phase 2 enrichment only. */

export type AfTeam = {
  id: number;
  name: string;
  country?: string;
};

export type AfTeamSearchResponse = { response: { team: AfTeam }[] };

export type AfFixture = {
  fixture: { id: number; date: string };
  teams: { home: AfTeam; away: AfTeam };
};

export type AfFixturesResponse = { response: AfFixture[] };

export type AfLineupPlayer = {
  player: { id: number; name: string; number: number; pos: string | null; grid: string | null };
};

export type AfLineup = {
  team: AfTeam;
  coach: { id: number; name: string };
  formation: string;
  startXI: AfLineupPlayer[];
  substitutes: AfLineupPlayer[];
};

export type AfLineupsResponse = { response: AfLineup[] };

export type AfStatistic = { type: string; value: number | string | null };
export type AfTeamStatistics = { team: AfTeam; statistics: AfStatistic[] };
export type AfStatisticsResponse = { response: AfTeamStatistics[] };

export type AfEvent = {
  time: { elapsed: number; extra: number | null };
  team: AfTeam;
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: 'Goal' | 'Card' | 'subst' | 'Var';
  detail: string;
  comments: string | null;
};

export type AfEventsResponse = { response: AfEvent[] };

export type AfSquadPlayer = {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
};

export type AfSquadResponse = { response: { team: AfTeam; players: AfSquadPlayer[] }[] };

export type AfCoach = {
  id: number;
  name: string;
  photo: string;
};

export type AfCoachResponse = { response: AfCoach[] };
