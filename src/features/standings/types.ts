/** Normalized view-models for the standings feature (parsed from the raw API shapes). */

export type StandingTeam = {
  id: string;
  name: string;
  flag?: string;
  fifaCode?: string;
};

export type StandingRow = {
  team: StandingTeam;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
};

export type StandingsGroup = {
  name: string;
  rows: StandingRow[];
};
