import { isToday } from 'date-fns';

import type { Match, MatchBucket } from '@/features/matches/types';

/**
 * Bucket matches into past / today / upcoming.
 * Live matches and anything kicking off today land in "today". Earlier matches are "past",
 * later ones are "upcoming". Matches with an unparseable date fall back to "upcoming".
 */
export function bucketOf(match: Match, now: Date = new Date()): MatchBucket {
  if (match.status === 'live') return 'today';
  if (Number.isNaN(match.kickoff.getTime())) return 'upcoming';
  if (isToday(match.kickoff)) return 'today';
  return match.kickoff.getTime() < now.getTime() ? 'past' : 'upcoming';
}

export function groupByBucket(matches: Match[], now: Date = new Date()) {
  const buckets: Record<MatchBucket, Match[]> = { past: [], today: [], upcoming: [] };
  for (const match of matches) {
    buckets[bucketOf(match, now)].push(match);
  }
  // Past: most recent first. Today & upcoming: soonest first.
  buckets.past.sort((a, b) => b.kickoff.getTime() - a.kickoff.getTime());
  buckets.today.sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime());
  buckets.upcoming.sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime());
  return buckets;
}
