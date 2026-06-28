import { findStadiumEnrichment } from '@/features/venues/data/stadium-enrichment';
import type { VenueSummary } from '@/features/venues/types';

function makeVenue(overrides: Partial<VenueSummary>): VenueSummary {
  return { id: '1', name: 'Some Stadium', city: 'Some City', country: 'USA', capacity: 50000, region: 'East', ...overrides };
}

describe('findStadiumEnrichment', () => {
  it('matches a known host city by exact city name', () => {
    const venue = makeVenue({ city: 'Mexico City' });
    expect(findStadiumEnrichment(venue)?.hostCity).toBe('Mexico City');
  });

  it('matches case-insensitively and on partial city fragments', () => {
    const venue = makeVenue({ city: 'East Rutherford, NJ' });
    expect(findStadiumEnrichment(venue)?.hostCity).toBe('New York / New Jersey');
  });

  it('returns null for a city with no enrichment entry', () => {
    const venue = makeVenue({ city: 'Nowhere' });
    expect(findStadiumEnrichment(venue)).toBeNull();
  });
});
