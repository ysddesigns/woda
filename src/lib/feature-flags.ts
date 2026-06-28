/**
 * Feature flags — gate Phase 2/3 surfaces so they can be revealed via OTA (EAS Update)
 * without a store resubmission.
 *
 * OTA-shippable features (pure JS) flip here and ship on the `production` channel.
 * Features needing native code or OS permissions (notifications, maps) must ship in a new
 * binary build FIRST, then be enabled here — never declare an unused permission.
 *
 * `DEFAULT_FLAGS` are bundled safe defaults. `fetchRemoteFlags()` can later override them
 * from a remote JSON endpoint (wired through TanStack Query) for instant toggles.
 */

export type FeatureFlags = {
  standings: boolean;
  bracket: boolean;
  teams: boolean;
  venues: boolean;
  search: boolean;
  shareMatch: boolean;
  // Requires a binary build (native module) before enabling:
  notifications: boolean;
};

export const DEFAULT_FLAGS: FeatureFlags = {
  standings: false,
  bracket: false,
  teams: false,
  venues: false,
  search: false,
  shareMatch: false,
  // expo-notifications native module shipped in this binary build — flagged on by default.
  notifications: true,
};

let activeFlags: FeatureFlags = { ...DEFAULT_FLAGS };

export function getFlags(): FeatureFlags {
  return activeFlags;
}

export function isEnabled(flag: keyof FeatureFlags): boolean {
  return activeFlags[flag];
}

/** Merge a (partial) remote override into the active flags. Safe against unknown keys. */
export function applyRemoteFlags(remote: Partial<FeatureFlags> | null | undefined): FeatureFlags {
  if (!remote) return activeFlags;
  activeFlags = { ...DEFAULT_FLAGS, ...remote };
  return activeFlags;
}
