/** Loosely normalizes a team name for fuzzy matching across data sources (no shared ID). */
export function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/\b(national team|women|men)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function teamNamesMatch(a: string, b: string): boolean {
  const na = normalizeTeamName(a);
  const nb = normalizeTeamName(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}
