import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Persists resolved cross-API ID mappings (e.g. worldcup26.ir team id -> API-Football team id)
 * so the fuzzy name/date matching in resolve-fixture-id.ts and resolve-team-id.ts only runs once
 * per entity, not on every app open.
 */
const PREFIX = 'woda-id-map:';

export async function getCachedId(namespace: string, key: string): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(`${PREFIX}${namespace}:${key}`);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export async function setCachedId(namespace: string, key: string, value: number): Promise<void> {
  try {
    await AsyncStorage.setItem(`${PREFIX}${namespace}:${key}`, String(value));
  } catch {
    // Non-fatal — just means resolution re-runs next time.
  }
}
