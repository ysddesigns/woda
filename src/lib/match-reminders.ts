/**
 * Schedules local "kickoff soon" reminders for favorite teams' upcoming matches, on top of
 * the permission/channel plumbing in notifications.ts. Local-only (on-device scheduling) —
 * live goal/score alerts would need a backend polling the API, which doesn't exist yet.
 */

import * as Notifications from 'expo-notifications';

import type { Match } from '@/features/matches/types';

const REMINDER_LEAD_MINUTES = 15;

export async function syncFavoriteMatchReminders(matches: Match[], favoriteTeamIds: string[]): Promise<void> {
  // This is currently the only thing that schedules local notifications in the app, so a
  // full cancel + reschedule on every sync is safe and avoids tracking individual ids.
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (favoriteTeamIds.length === 0) return;
  const favorites = new Set(favoriteTeamIds);
  const now = Date.now();

  const upcoming = matches.filter(
    (m) =>
      m.status === 'upcoming' &&
      (favorites.has(m.home.id) || favorites.has(m.away.id)) &&
      !Number.isNaN(m.kickoff.getTime()) &&
      m.kickoff.getTime() - REMINDER_LEAD_MINUTES * 60 * 1000 > now,
  );

  await Promise.all(
    upcoming.map((match) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Kickoff soon',
          body: `${match.home.name} vs ${match.away.name} kicks off in ${REMINDER_LEAD_MINUTES} minutes`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(match.kickoff.getTime() - REMINDER_LEAD_MINUTES * 60 * 1000),
        },
      }),
    ),
  );
}
