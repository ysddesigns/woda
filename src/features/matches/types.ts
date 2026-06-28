/** Normalized view-models for the matches feature (parsed from the raw API shapes). */

export type MatchStatus = 'upcoming' | 'live' | 'finished';

export type MatchTeam = {
  id: string;
  name: string;
  flag?: string; // undefined when the team is a knockout placeholder
  fifaCode?: string;
  isPlaceholder: boolean;
};

export type Match = {
  id: string;
  home: MatchTeam;
  away: MatchTeam;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  kickoff: Date;
  /** Elapsed minute label when live, e.g. "57". */
  minute: string | null;
  group: string;
  stage: string;
  venue?: { name: string; city: string };
};

export type MatchBucket = 'past' | 'today' | 'upcoming';
