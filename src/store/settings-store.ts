import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';

type SettingsState = {
  themePreference: ThemePreference;
  /** Master toggle for any match notifications (gated by binary capability later). */
  notificationsEnabled: boolean;
  setThemePreference: (pref: ThemePreference) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      notificationsEnabled: false,
      setThemePreference: (themePreference) => set({ themePreference }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
    }),
    {
      name: 'woda-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
