import { test, expect } from '@jest/globals';
import { createFilterCache, getFilterCoefficients } from '../src/filter.mjs';

test('covers filter coefficient edge branches', () => {
  const cache = createFilterCache();
  const first = getFilterCoefficients(cache, 0, 1, 2);
  expect(first.hit).toBe(false);
  expect(first.coefficients[1][1]).toBe(1);
  expect(first.coefficients[3][1]).toBeCloseTo(0, 30);
  expect(getFilterCoefficients(cache, 0, 1, 2).hit).toBe(true);

  for (let i = 1; i <= 4096; i++) getFilterCoefficients(cache, i / 10000, 1, 1);
  const uncached = getFilterCoefficients(cache, 0.987654321, 1, 1);
  expect(uncached.hit).toBe(false);
  expect(cache.size).toBe(4096);
});
