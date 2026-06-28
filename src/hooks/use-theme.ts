/**
 * Returns the active color palette (light/dark), honoring the user's theme preference.
 * See https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  return Colors[scheme];
}
