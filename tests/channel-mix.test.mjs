import { test, expect } from '@jest/globals';
import { mapChannels } from '../src/channel-mix.mjs';

test.each([
  [[0.25], 1, 1, [0.25]],
  [[0.25], 1, 2, [0.25, 0.25]],
  [[0.25, 0.75], 2, 1, [0.5]],
  [[0.25, 0.75], 2, 2, [0.25, 0.75]],
])('maps %s from %s channel(s) to %s channel(s)', (values, inChannels, outChannels, expected) => {
  expect(mapChannels(values, inChannels, outChannels)).toEqual(expected);
});
