import { closestForecast, type ForecastEntry } from '@/api/openweather-client';

function entry(dt: number): ForecastEntry {
  return { dt, main: { temp: 20, feels_like: 20, humidity: 50 }, weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }] };
}

describe('closestForecast', () => {
  const baseSeconds = 1_700_000_000;
  const entries: ForecastEntry[] = [
    entry(baseSeconds),
    entry(baseSeconds + 3 * 3600),
    entry(baseSeconds + 6 * 3600),
  ];

  it('picks the entry nearest the target time', () => {
    const target = new Date((baseSeconds + 3 * 3600 + 100) * 1000);
    expect(closestForecast(entries, target)).toBe(entries[1]);
  });

  it('returns null when the target is beyond the forecast horizon', () => {
    const beyond = new Date((baseSeconds + 100 * 3600) * 1000);
    expect(closestForecast(entries, beyond)).toBeNull();
  });

  it('returns null for an empty forecast list', () => {
    expect(closestForecast([], new Date())).toBeNull();
  });
});
