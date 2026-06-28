/**
 * Minimal typed wrapper for the OpenWeatherMap free-tier "5 day / 3 hour" forecast endpoint.
 * Used only for venue weather (Phase 2) — never blocks venue rendering if the key is missing
 * or the request fails; callers should treat any thrown error as "weather unavailable".
 */

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export type ForecastEntry = {
  dt: number; // unix seconds
  main: { temp: number; feels_like: number; humidity: number };
  weather: { main: string; description: string; icon: string }[];
};

type ForecastResponse = { list: ForecastEntry[] };

export function isWeatherConfigured(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_OPENWEATHER_KEY);
}

export async function getForecast(lat: number, lng: number, signal?: AbortSignal): Promise<ForecastEntry[]> {
  const key = process.env.EXPO_PUBLIC_OPENWEATHER_KEY;
  if (!key) throw new Error('OpenWeatherMap API key not configured');

  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${key}`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`OpenWeatherMap request failed (${response.status})`);

  const data = (await response.json()) as ForecastResponse;
  return data.list ?? [];
}

/** Picks the forecast entry closest to a target time, or null if it falls outside the 5-day window. */
export function closestForecast(entries: ForecastEntry[], target: Date): ForecastEntry | null {
  const targetMs = target.getTime();
  const horizon = entries.at(-1);
  if (!horizon || targetMs > horizon.dt * 1000) return null;

  return entries.reduce<ForecastEntry | null>((closest, entry) => {
    if (!closest) return entry;
    const closestDiff = Math.abs(closest.dt * 1000 - targetMs);
    const entryDiff = Math.abs(entry.dt * 1000 - targetMs);
    return entryDiff < closestDiff ? entry : closest;
  }, null);
}
