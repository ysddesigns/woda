import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useSettingsStore } from '@/store/settings-store';

/**
 * Resolved color scheme = user preference (system/light/dark) merged with the OS scheme.
 * Returns 'light' | 'dark' (never null/unspecified) so consumers can index the theme safely.
 */
export function useColorScheme(): 'light' | 'dark' {
  const system = useSystemColorScheme();
  const preference = useSettingsStore((s) => s.themePreference);

  if (preference === 'light' || preference === 'dark') {
    return preference;
  }
  return system === 'dark' ? 'dark' : 'light';
}
