import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { useSettingsStore } from '@/store/settings-store';

const emptySubscribe = () => () => {};

/**
 * Web: resolve color scheme on the client after hydration (static rendering safe),
 * merged with the user's theme preference. `useSyncExternalStore` returns `false` during
 * server render and `true` on the client without a setState-in-effect.
 */
export function useColorScheme(): 'light' | 'dark' {
  const hasHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const system = useRNColorScheme();
  const preference = useSettingsStore((s) => s.themePreference);

  if (!hasHydrated) {
    return 'light';
  }
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }
  return system === 'dark' ? 'dark' : 'light';
}
