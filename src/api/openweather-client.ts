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

let warnedMissingKey = false;

export function isWeatherConfigured(): boolean {
  const configured = Boolean(process.env.EXPO_PUBLIC_OPENWEATHER_KEY);
  if (!configured && __DEV__ && !warnedMissingKey) {
    warnedMissingKey = true;
    console.warn(
      '[openweather] EXPO_PUBLIC_OPENWEATHER_KEY is not set in this build — venue weather will stay in its "not configured" state. Local dev: add it to .env and restart Metro with --clear. EAS builds: register it with `eas env:create`.',
    );
  }
  return configured;
}

export async function getForecast(lat: number, lng: number, signal?: AbortSignal): Promise<ForecastEntry[]> {
  const key = process.env.EXPO_PUBLIC_OPENWEATHER_KEY;
  if (!key) throw new Error('OpenWeatherMap API key not configured');

  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${key}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    if (__DEV__) {
      const body = await response.text().catch(() => '');
      console.warn(`[openweather] forecast -> ${response.status}: ${body.slice(0, 300)}`);
    }
    throw new Error(`OpenWeatherMap request failed (${response.status})`);
  }

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
