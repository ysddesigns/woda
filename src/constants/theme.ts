/**
 * Woda design tokens — derived from DESIGN_RULES.md (8pt grid, type scale, color system).
 * Native-first: consumed via inline styles. No Tailwind/NativeWind.
 *
 * NOTE: keep every key present in BOTH `light` and `dark` so `ThemeColor` stays valid and
 * `useTheme()[key]` is always safe.
 */

import '@/global.css';

import { Platform } from 'react-native';

// ── Color system (DESIGN_RULES §3) ───────────────────────────────────────────
// Football-themed: pitch green primary, gold accent, red for live. Never pure #000/#FFF.
export const Colors = {
  light: {
    text: '#111827', // neutral-900
    textSecondary: '#60646C', // neutral-600
    textHint: '#9CA3AF', // neutral-400
    background: '#F9FAFB', // neutral-50 (offset, not pure white)
    card: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    border: '#E5E7EB', // neutral-200
    primary: '#15803D', // pitch green
    primaryDark: '#166534',
    onPrimary: '#FFFFFF',
    accent: '#F59E0B', // gold — 1 per screen, used sparingly
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
    live: '#EF4444', // live match red
  },
  dark: {
    text: '#F9FAFB',
    textSecondary: '#B0B4BA',
    textHint: '#6B7280',
    background: '#0B0F14', // offset, not pure black
    card: '#16181D',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    border: '#2A2E35',
    primary: '#22C55E',
    primaryDark: '#16A34A',
    onPrimary: '#06210F',
    accent: '#FBBF24',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#F87171',
    info: '#60A5FA',
    live: '#F87171',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// ── Spacing (DESIGN_RULES §1 — 8pt grid) ─────────────────────────────────────
export const Spacing = {
  xs: 4, // space-1
  sm: 8, // space-2
  md: 12, // space-3
  lg: 16, // space-4 — standard screen horizontal padding
  xl: 20, // space-5
  '2xl': 24, // space-6 — section gap
  '3xl': 32, // space-8
  '4xl': 40, // space-10
  '5xl': 48, // space-12
  '6xl': 64, // space-16
} as const;

// ── Typography (DESIGN_RULES §2 — mobile scale) ──────────────────────────────
export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// ── Radius / motion / elevation ──────────────────────────────────────────────
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16, // app-wide card radius (DESIGN_RULES §4 — pick one)
  full: 9999,
} as const;

export const Duration = {
  instant: 0,
  micro: 100,
  fast: 200,
  normal: 300,
  slow: 400,
  lazy: 600,
} as const;

export const ZIndex = {
  base: 0,
  sticky: 10,
  dropdown: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
  tooltip: 60,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
