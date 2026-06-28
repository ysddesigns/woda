import { distanceKm } from '@/features/venues/lib/distance';

describe('distanceKm', () => {
  it('returns 0 for identical coordinates', () => {
    expect(distanceKm({ lat: 40.8135, lng: -74.0744 }, { lat: 40.8135, lng: -74.0744 })).toBe(0);
  });

  it('matches the known great-circle distance between two real cities within 1%', () => {
    // New York City to Los Angeles is ~3936 km.
    const nyc = { lat: 40.7128, lng: -74.006 };
    const la = { lat: 34.0522, lng: -118.2437 };
    const result = distanceKm(nyc, la);
    expect(result).toBeGreaterThan(3936 * 0.99);
    expect(result).toBeLessThan(3936 * 1.01);
  });

  it('is symmetric', () => {
    const a = { lat: 19.3029, lng: -99.1505 };
    const b = { lat: 49.2768, lng: -123.1133 };
    expect(distanceKm(a, b)).toBeCloseTo(distanceKm(b, a), 6);
  });
});
