import type { Match } from '@/features/matches/types';

export type BracketRound = {
  key: string;
  label: string;
  matches: Match[];
};

const ROUND_ORDER = ['r32', 'r16', 'qf', 'sf', 'f'];
const ROUND_LABELS: Record<string, string> = {
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-final',
  sf: 'Semi-final',
  f: 'Final',
};

export function groupByRound(matches: Match[]): BracketRound[] {
  const knockout = matches.filter((m) => m.stage !== 'group');

  return ROUND_ORDER.filter((key) => knockout.some((m) => m.stage === key)).map((key) => ({
    key,
    label: ROUND_LABELS[key] ?? key.toUpperCase(),
    matches: knockout
      .filter((m) => m.stage === key)
      .sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime()),
  }));
}
