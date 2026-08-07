import { test, expect } from '@jest/globals';
import { validateOptions } from '../src/validate-options.mjs';

test('accepts valid options', () => {
  expect(() => validateOptions({
    inRate: 48000,
    outRate: 24000,
    inChannels: 2,
    outChannels: 1,
    filterWindow: 8,
    volume: 0.5,
  })).not.toThrow();
});

test.each([
  { inRate: 0, outRate: 24000, inChannels: 1, outChannels: 1, filterWindow: 8, volume: 1 },
  { inRate: 48000, outRate: 0, inChannels: 1, outChannels: 1, filterWindow: 8, volume: 1 },
  { inRate: 48000, outRate: 24000, inChannels: 3, outChannels: 1, filterWindow: 8, volume: 1 },
  { inRate: 48000, outRate: 24000, inChannels: 1, outChannels: 3, filterWindow: 8, volume: 1 },
  { inRate: 48000, outRate: 24000, inChannels: 1, outChannels: 1, filterWindow: 0, volume: 1 },
  { inRate: 48000, outRate: 24000, inChannels: 1, outChannels: 1, filterWindow: 8, volume: NaN },
])('rejects invalid options %#', options => {
  expect(() => validateOptions(options)).toThrow(TypeError);
});
