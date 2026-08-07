import { test, expect } from '@jest/globals';
import * as entrypoint from '../index.mjs';
import { Resampler } from '../src/resampler.mjs';

test('exports Resampler from the package entrypoint', () => {
  expect(entrypoint.Resampler).toBe(Resampler);
});
