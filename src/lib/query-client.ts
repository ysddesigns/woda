import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';

/**
 * Query cache config. Live games need frequent refetch; reference data (teams, stadiums)
 * is effectively static. The persister hydrates the cache from disk on launch so the app
 * opens with last-known data + a timestamp when offline (PRD §6).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 min default
      gcTime: 1000 * 60 * 60 * 24, // keep 24h for offline hydration
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'woda-query-cache',
});

/** How fresh-on-screen live data should be. Used by the games query. */
export const LIVE_STALE_TIME = 30 * 1000;
export const STATIC_STALE_TIME = 1000 * 60 * 60 * 6; // 6h for teams/stadiums
