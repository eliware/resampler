import { writePcmOutput } from "../src/pcm-output.mjs";

test("scales and encodes samples as little-endian PCM", () => {
  const output = writePcmOutput({ volume: 0.5 }, [0.5, -0.5]);

  expect(output.readInt16LE(0)).toBe(8192);
  expect(output.readInt16LE(2)).toBe(-8192);
});

test("clips samples to the signed PCM range", () => {
  const output = writePcmOutput({ volume: 2 }, [2, -2]);

  expect(output.readInt16LE(0)).toBe(32767);
  expect(output.readInt16LE(2)).toBe(-32768);
});
