/** Normalized view-models for the matches feature (parsed from the raw API shapes). */

import type { ScorerEvent } from '@/features/matches/lib/parse-scorers';

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
  matchday: string;
  venue?: { name: string; city: string; capacity?: number };
  homeScorers: ScorerEvent[];
  awayScorers: ScorerEvent[];
};

export type MatchBucket = 'past' | 'today' | 'upcoming';
