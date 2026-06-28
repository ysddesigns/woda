import { teamNamesMatch, normalizeTeamName } from '@/features/matches/lib/normalize-team-name';

describe('normalizeTeamName', () => {
  it('lowercases and strips non-alphanumeric characters', () => {
    expect(normalizeTeamName('Côte d\'Ivoire')).toBe('cote d ivoire');
  });

  it('strips "national team" qualifiers', () => {
    expect(normalizeTeamName('USA National Team')).toBe('usa');
  });
});

describe('teamNamesMatch', () => {
  it('matches identical names', () => {
    expect(teamNamesMatch('Brazil', 'Brazil')).toBe(true);
  });

  it('matches when one name is a superstring of the other', () => {
    expect(teamNamesMatch('USA', 'USA National Team')).toBe(true);
  });

  it('does not match unrelated names', () => {
    expect(teamNamesMatch('Brazil', 'Argentina')).toBe(false);
  });
});
