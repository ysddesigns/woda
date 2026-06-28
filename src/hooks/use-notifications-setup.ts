import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { ensureAndroidChannel } from '@/lib/notifications';

/**
 * App-wide notification wiring: Android channel + tap-to-navigate.
 * Mount once at the root. Does not request permission — that's an explicit user action
 * (see Settings screen), per platform guidelines (never prompt on launch).
 */
export function useNotificationsSetup() {
  useEffect(() => {
    ensureAndroidChannel();

    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const matchId = response.notification.request.content.data?.matchId;
      if (typeof matchId === 'string') {
        router.push({ pathname: '/game/[id]', params: { id: matchId } });
      }
    });

    return () => sub.remove();
  }, []);
}
