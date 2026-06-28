import type { ApiStadium } from '@/api/types';
import type { VenueSummary } from '@/features/venues/types';

export function normalizeVenue(stadium: ApiStadium): VenueSummary {
  return {
    id: stadium.id,
    name: stadium.fifa_name || stadium.name_en,
    city: stadium.city_en,
    country: stadium.country_en,
    capacity: stadium.capacity,
    region: stadium.region,
  };
}
