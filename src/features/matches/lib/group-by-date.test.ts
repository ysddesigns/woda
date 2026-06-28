import { filterMatches } from '@/features/matches/lib/group-by-date';
import type { Match } from '@/features/matches/types';

function makeMatch(overrides: Partial<Match>): Match {
  return {
    id: '1',
    home: { id: 'h', name: 'Home', isPlaceholder: false },
    away: { id: 'a', name: 'Away', isPlaceholder: false },
    homeScore: null,
    awayScore: null,
    status: 'upcoming',
    kickoff: new Date('2026-06-15T18:00:00'),
    minute: null,
    group: 'A',
    stage: 'group',
    matchday: '1',
    venue: { name: 'MetLife Stadium', city: 'East Rutherford' },
    homeScorers: [],
    awayScorers: [],
    ...overrides,
  };
}

describe('filterMatches', () => {
  const matches: Match[] = [
    makeMatch({ id: '1', group: 'A', venue: { name: 'MetLife Stadium', city: 'East Rutherford' } }),
    makeMatch({ id: '2', group: 'B', venue: { name: 'Estadio Azteca', city: 'Mexico City' } }),
    makeMatch({ id: '3', group: 'A', venue: { name: 'Estadio Azteca', city: 'Mexico City' } }),
  ];

  it('returns all matches when no filters are set', () => {
    expect(filterMatches(matches, { group: null, stadium: null })).toHaveLength(3);
  });

  it('filters by group', () => {
    const result = filterMatches(matches, { group: 'A', stadium: null });
    expect(result.map((m) => m.id)).toEqual(['1', '3']);
  });

  it('filters by stadium', () => {
    const result = filterMatches(matches, { group: null, stadium: 'Estadio Azteca' });
    expect(result.map((m) => m.id)).toEqual(['2', '3']);
  });

  it('combines group and stadium filters', () => {
    const result = filterMatches(matches, { group: 'A', stadium: 'Estadio Azteca' });
    expect(result.map((m) => m.id)).toEqual(['3']);
  });

  it('excludes matches with no venue when a stadium filter is set', () => {
    const noVenue = makeMatch({ id: '4', venue: undefined });
    const result = filterMatches([...matches, noVenue], { group: null, stadium: 'MetLife Stadium' });
    expect(result.map((m) => m.id)).toEqual(['1']);
  });
});
