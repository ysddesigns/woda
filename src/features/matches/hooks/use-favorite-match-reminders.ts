import { useEffect } from 'react';

import type { Match } from '@/features/matches/types';
import { isEnabled } from '@/lib/feature-flags';
import { syncFavoriteMatchReminders } from '@/lib/match-reminders';
import { useFavoritesStore } from '@/store/favorites-store';
import { useSettingsStore } from '@/store/settings-store';

/** Keeps scheduled kickoff reminders in sync with favorite teams + the notifications toggle. */
export function useFavoriteMatchReminders(matches: Match[]) {
  const teamIds = useFavoritesStore((s) => s.teamIds);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);

  useEffect(() => {
    if (!isEnabled('notifications') || !notificationsEnabled) {
      syncFavoriteMatchReminders([], []);
      return;
    }
    syncFavoriteMatchReminders(matches, teamIds);
  }, [matches, teamIds, notificationsEnabled]);
}
