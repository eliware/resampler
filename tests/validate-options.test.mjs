import { validateOptions } from "../src/validate-options.mjs";
import { Resampler } from "../src/resampler.mjs";

test("accepts valid options", () => {
  expect(() =>
    validateOptions({
      inRate: 48000,
      outRate: 24000,
      inChannels: 2,
      outChannels: 1,
      filterWindow: 8,
      volume: 0.5,
    }),
  ).not.toThrow();
});

test.each([
  { inRate: 0, outRate: 24000, inChannels: 1, outChannels: 1, filterWindow: 8, volume: 1 },
  { inRate: 48000, outRate: 0, inChannels: 1, outChannels: 1, filterWindow: 8, volume: 1 },
  { inRate: 48000, outRate: 24000, inChannels: 3, outChannels: 1, filterWindow: 8, volume: 1 },
  { inRate: 48000, outRate: 24000, inChannels: 1, outChannels: 3, filterWindow: 8, volume: 1 },
  { inRate: 48000, outRate: 24000, inChannels: 1, outChannels: 1, filterWindow: 0, volume: 1 },
  { inRate: 48000, outRate: 24000, inChannels: 1, outChannels: 1, filterWindow: 8, volume: NaN },
])("rejects invalid options %#", (options) => {
  expect(() => validateOptions(options)).toThrow(TypeError);
});

test("rejects missing constructor options", () => {
  expect(() => new Resampler()).toThrow(TypeError);
});

test.each([
  ["outRate", { inRate: 24000, outRate: Infinity }],
  ["filterWindow fraction", { inRate: 24000, outRate: 24000, filterWindow: 2.5 }],
  ["filterWindow limit", { inRate: 24000, outRate: 24000, filterWindow: 4097 }],
  ["inRate limit", { inRate: 1000001, outRate: 24000 }],
  ["outRate limit", { inRate: 24000, outRate: 1000001 }],
])("rejects invalid constructor %s", (_, options) => {
  expect(() => new Resampler(options)).toThrow(TypeError);
});
