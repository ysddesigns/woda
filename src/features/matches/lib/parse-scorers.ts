/**
 * Best-effort parser for the API's `home_scorers`/`away_scorers` fields.
 * These are documented only as "stringified array or null" with no confirmed shape — so this
 * never throws and never fabricates a goal. Anything that doesn't clearly look like a scorer
 * entry is dropped; an unparseable or empty field returns [].
 */

export type ScorerEvent = {
  name: string;
  minute: number | null;
};

function coerceEntry(entry: unknown): ScorerEvent | null {
  if (typeof entry === 'string') {
    const match = entry.match(/^(.*?)(?:\D|^)(\d{1,3})'?\s*$/);
    if (match) {
      return { name: match[1].trim() || entry.trim(), minute: Number(match[2]) };
    }
    return entry.trim() ? { name: entry.trim(), minute: null } : null;
  }

  if (entry && typeof entry === 'object') {
    const obj = entry as Record<string, unknown>;
    const name = obj.name ?? obj.player ?? obj.player_name ?? obj.scorer;
    const minuteRaw = obj.minute ?? obj.time ?? obj.min;
    if (typeof name !== 'string' || !name.trim()) return null;
    const minute = Number(minuteRaw);
    return { name: name.trim(), minute: Number.isFinite(minute) ? minute : null };
  }

  return null;
}

export function parseScorers(raw: string | null | undefined): ScorerEvent[] {
  if (!raw || raw === 'null') return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map(coerceEntry)
    .filter((e): e is ScorerEvent => e !== null);
}
