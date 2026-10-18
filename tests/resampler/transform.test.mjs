import { transformResampler } from "../../src/resampler/transform.mjs";
import { Resampler } from "../../src/resampler.mjs";

test("transforms PCM samples and calls the stream callback", () => {
  const resampler = new Resampler({ inRate: 24000, outRate: 24000, filterWindow: 1 });
  let callCount = 0;
  const callback = () => {
    callCount++;
  };

  transformResampler(resampler, Buffer.alloc(12), callback);

  expect(callCount).toBe(1);
  expect(resampler.read()).toBeInstanceOf(Buffer);
});
