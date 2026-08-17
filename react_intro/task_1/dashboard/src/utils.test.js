import { getCurrentYear, getFooterCopy } from './utils';

describe('utils tests', () => {
  test('getCurrentYear returns the current year', () => {
    expect(getCurrentYear()).toBe(new Date().getFullYear());
  });

  test('getFooterCopy returns correct string based on isIndex argument', () => {
    expect(getFooterCopy(true)).toBe('Holberton School');
    expect(getFooterCopy(false)).toBe('Holberton School main dashboard');
  });
});
