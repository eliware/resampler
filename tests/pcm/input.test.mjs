import { readPcmInput } from "../../src/pcm/input.mjs";

function makeResampler(inChannels = 1) {
  return {
    inChannels,
    pending: Buffer.alloc(0),
    buffers: Array.from({ length: inChannels }, () => []),
  };
}

test("decodes complete little-endian PCM frames", () => {
  const resampler = makeResampler();
  const input = Buffer.from([0, 64, 0, 192]);

  expect(readPcmInput(resampler, input)).toBe(4);
  expect(resampler.buffers[0]).toEqual([0.5, -0.5]);
  expect(resampler.pending).toEqual(Buffer.alloc(0));
});

test("keeps an incomplete frame until the next chunk", () => {
  const resampler = makeResampler(2);
  const first = Buffer.from([0, 64, 0]);

  expect(readPcmInput(resampler, first)).toBe(0);
  expect(resampler.pending).toEqual(first);
  expect(readPcmInput(resampler, Buffer.from([192]))).toBe(4);
  expect(resampler.buffers).toEqual([[0.5], [-0.5]]);
  expect(resampler.pending).toEqual(Buffer.alloc(0));
});
