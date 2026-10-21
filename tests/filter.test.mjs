import { createFilterCache, getFilterCoefficients } from "../src/filter.mjs";
import { Resampler } from "../src/resampler.mjs";

function collect(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

test("covers filter coefficient edge branches", () => {
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

test("keys cached coefficients by phase, cutoff, and filter window", () => {
  const cache = createFilterCache();
  const first = getFilterCoefficients(cache, 0.25, 1, 2);
  const changedCutoff = getFilterCoefficients(cache, 0.25, 0.5, 2);
  const changedWindow = getFilterCoefficients(cache, 0.25, 0.5, 3);

  expect(first.hit).toBe(false);
  expect(changedCutoff.hit).toBe(false);
  expect(changedWindow.hit).toBe(false);
  expect(getFilterCoefficients(cache, 0.25, 0.5, 3).hit).toBe(true);
  expect(changedCutoff.coefficients).not.toEqual(first.coefficients);
});

test("uses an anti-alias cutoff when downsampling", () => {
  const downsampler = new Resampler({ inRate: 48000, outRate: 24000 });
  const upsampler = new Resampler({ inRate: 24000, outRate: 48000 });
  expect(downsampler.cutoff).toBe(0.5);
  expect(upsampler.cutoff).toBe(1);
});

test("preserves DC level through resampling", async () => {
  const input = Buffer.alloc(2 * 256);
  for (let i = 0; i < 256; i++) input.writeInt16LE(10000, i * 2);
  const resampler = new Resampler({ inRate: 48000, outRate: 24000 });
  const outBuf = await collect(resampler.end(input));
  const values = [];
  for (let i = 16; i < outBuf.length / 2 - 16; i++) values.push(outBuf.readInt16LE(i * 2));
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  expect(mean).toBeGreaterThan(9900);
  expect(mean).toBeLessThan(10100);
});

test("attenuates frequencies above the downsampling Nyquist limit", async () => {
  const input = Buffer.alloc(2 * 2048);
  for (let i = 0; i < 2048; i++) {
    const sample = Math.round(Math.sin((2 * Math.PI * 18000 * i) / 48000) * 12000);
    input.writeInt16LE(sample, i * 2);
  }
  const resampler = new Resampler({ inRate: 48000, outRate: 24000 });
  const outBuf = await collect(resampler.end(input));
  let peak = 0;
  for (let i = 32; i < outBuf.length / 2 - 32; i++)
    peak = Math.max(peak, Math.abs(outBuf.readInt16LE(i * 2)));
  expect(peak).toBeLessThan(1200);
});

test.each([
  [48000, 24000, 4993],
  [24000, 48000, 19969],
  [44100, 48000, 10867],
  [48000, 44100, 9173],
])("emits the expected frame count for %sHz to %sHz", async (inRate, outRate, expectedFrames) => {
  const input = Buffer.alloc(2 * 10000);
  const output = await collect(new Resampler({ inRate, outRate }).end(input));
  expect(output.length).toBe(expectedFrames * 2);
});

test("emits no samples for empty input", async () => {
  const output = await collect(new Resampler({ inRate: 48000, outRate: 24000 }).end());
  expect(output).toHaveLength(0);
});

test("handles input shorter than the filter window", async () => {
  const input = Buffer.alloc(2 * 4);
  const output = await collect(new Resampler({ inRate: 48000, outRate: 24000 }).end(input));
  expect(output).toHaveLength(0);
});
