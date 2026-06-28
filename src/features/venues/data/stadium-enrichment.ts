import type { VenueSummary } from '@/features/venues/types';

/**
 * Hand-curated facts about the 16 confirmed FIFA World Cup 2026 host stadiums.
 * Not sourced from any API: there are only 16 of these, they're fixed for the tournament,
 * and matching them to a third-party venue database by name is fuzzier and less reliable
 * than just keying this list off `city` (worldcup26.ir's `city_en` is stable and unambiguous).
 *
 * `image` is left undefined — bundling real stadium photography requires licensed assets
 * the user needs to supply (e.g. `require('@/assets/images/stadiums/metlife.jpg')`); the UI
 * falls back to a placeholder when absent. Coordinates/timezone are public facts, safe to ship.
 */
export type StadiumEnrichment = {
  cityKeys: string[]; // lowercase fragments matched against VenueSummary.city
  hostCity: string;
  lat: number;
  lng: number;
  timezone: string; // IANA tz name
  image?: number; // require()'d asset id, once supplied
};

export const STADIUM_ENRICHMENT: StadiumEnrichment[] = [
  { cityKeys: ['east rutherford', 'new york', 'new jersey'], hostCity: 'New York / New Jersey', lat: 40.8135, lng: -74.0744, timezone: 'America/New_York' },
  { cityKeys: ['arlington', 'dallas'], hostCity: 'Dallas', lat: 32.7473, lng: -97.0945, timezone: 'America/Chicago' },
  { cityKeys: ['inglewood', 'los angeles'], hostCity: 'Los Angeles', lat: 33.9535, lng: -118.3392, timezone: 'America/Los_Angeles' },
  { cityKeys: ['santa clara', 'san francisco', 'bay area'], hostCity: 'San Francisco Bay Area', lat: 37.4030, lng: -121.9700, timezone: 'America/Los_Angeles' },
  { cityKeys: ['kansas city'], hostCity: 'Kansas City', lat: 39.0489, lng: -94.4839, timezone: 'America/Chicago' },
  { cityKeys: ['atlanta'], hostCity: 'Atlanta', lat: 33.7553, lng: -84.4006, timezone: 'America/New_York' },
  { cityKeys: ['miami'], hostCity: 'Miami', lat: 25.9580, lng: -80.2389, timezone: 'America/New_York' },
  { cityKeys: ['philadelphia'], hostCity: 'Philadelphia', lat: 39.9008, lng: -75.1675, timezone: 'America/New_York' },
  { cityKeys: ['foxborough', 'boston'], hostCity: 'Boston', lat: 42.0909, lng: -71.2643, timezone: 'America/New_York' },
  { cityKeys: ['houston'], hostCity: 'Houston', lat: 29.6847, lng: -95.4107, timezone: 'America/Chicago' },
  { cityKeys: ['seattle'], hostCity: 'Seattle', lat: 47.5952, lng: -122.3316, timezone: 'America/Los_Angeles' },
  { cityKeys: ['mexico city'], hostCity: 'Mexico City', lat: 19.3029, lng: -99.1505, timezone: 'America/Mexico_City' },
  { cityKeys: ['guadalajara'], hostCity: 'Guadalajara', lat: 20.6822, lng: -103.4622, timezone: 'America/Mexico_City' },
  { cityKeys: ['monterrey'], hostCity: 'Monterrey', lat: 25.6694, lng: -100.2436, timezone: 'America/Monterrey' },
  { cityKeys: ['vancouver'], hostCity: 'Vancouver', lat: 49.2768, lng: -123.1133, timezone: 'America/Vancouver' },
  { cityKeys: ['toronto'], hostCity: 'Toronto', lat: 43.6332, lng: -79.4185, timezone: 'America/Toronto' },
];

export function findStadiumEnrichment(venue: VenueSummary): StadiumEnrichment | null {
  const city = venue.city.toLowerCase();
  return STADIUM_ENRICHMENT.find((entry) => entry.cityKeys.some((key) => city.includes(key))) ?? null;
}
