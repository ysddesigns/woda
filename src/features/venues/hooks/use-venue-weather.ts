import { useQuery } from '@tanstack/react-query';

import { closestForecast, getForecast, isWeatherConfigured } from '@/api/openweather-client';
import type { StadiumEnrichment } from '@/features/venues/data/stadium-enrichment';

export type VenueWeatherStatus = 'unconfigured' | 'no-upcoming-match' | 'out-of-range' | 'loading' | 'error' | 'available';

export type UseVenueWeatherResult = {
  status: VenueWeatherStatus;
  tempC: number | null;
  description: string | null;
  icon: string | null;
};

const FORECAST_STALE_TIME = 1000 * 60 * 30; // 30 min — forecasts don't change minute to minute

/**
 * Live forecast for the next match at this venue. Only meaningful within OpenWeatherMap's
 * free 5-day window — outside that, returns 'out-of-range' rather than calling the API.
 */
export function useVenueWeather(
  enrichment: StadiumEnrichment | null,
  nextMatchKickoff: Date | null,
): UseVenueWeatherResult {
  // eslint-disable-next-line react-hooks/purity -- a few-second drift on this 5-day boundary check is harmless
  const now = Date.now();
  const withinWindow =
    nextMatchKickoff != null && nextMatchKickoff.getTime() - now <= 1000 * 60 * 60 * 24 * 5 && nextMatchKickoff.getTime() >= now;

  const query = useQuery({
    queryKey: ['venue-weather', enrichment?.lat, enrichment?.lng],
    queryFn: ({ signal }) => getForecast(enrichment!.lat, enrichment!.lng, signal),
    enabled: Boolean(enrichment) && isWeatherConfigured() && withinWindow,
    staleTime: FORECAST_STALE_TIME,
  });

  if (!isWeatherConfigured() || !enrichment) {
    return { status: 'unconfigured', tempC: null, description: null, icon: null };
  }
  if (!nextMatchKickoff) {
    return { status: 'no-upcoming-match', tempC: null, description: null, icon: null };
  }
  if (!withinWindow) {
    return { status: 'out-of-range', tempC: null, description: null, icon: null };
  }
  if (query.isLoading) {
    return { status: 'loading', tempC: null, description: null, icon: null };
  }
  if (query.isError || !query.data) {
    return { status: 'error', tempC: null, description: null, icon: null };
  }

  const entry = closestForecast(query.data, nextMatchKickoff);
  if (!entry) {
    return { status: 'out-of-range', tempC: null, description: null, icon: null };
  }

  return {
    status: 'available',
    tempC: Math.round(entry.main.temp),
    description: entry.weather[0]?.description ?? null,
    icon: entry.weather[0]?.icon ?? null,
  };
}
