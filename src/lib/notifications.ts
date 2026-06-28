/**
 * Push notification infra (Phase 2 capability, shipped in a binary build per the OTA plan —
 * see feature-flags.ts). Covers permission request, Expo push token retrieval, the required
 * Android notification channel, and the foreground display handler.
 *
 * Actual "notify me when my favorite team plays" scheduling is a later feature; this module
 * only sets up the platform plumbing so that work can land via OTA on top of it.
 */

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const DEFAULT_CHANNEL_ID = 'default';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
    name: 'Match updates',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200, 100, 200],
    lightColor: '#15803D',
  });
}

export type PermissionResult = 'granted' | 'denied' | 'unsupported';

/**
 * Requests notification permission. Returns 'unsupported' on simulators/emulators, which
 * cannot receive push tokens — callers should surface this distinctly from a user denial.
 */
export async function requestNotificationPermission(): Promise<PermissionResult> {
  if (!Device.isDevice) {
    return 'unsupported';
  }

  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return 'granted';

  const requested = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  return requested.granted ? 'granted' : 'denied';
}

/** Fetches the Expo push token. Call only after permission has been granted. */
export async function getExpoPushToken(): Promise<string | null> {
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;

  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data;
  } catch {
    return null;
  }
}
