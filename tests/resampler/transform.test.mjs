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

test("resumes a large transform when the readable side requests more data", () => {
  const resampler = new Resampler({ inRate: 24000, outRate: 48000 });
  let writeComplete = false;

  resampler.write(Buffer.alloc(40000), () => {
    writeComplete = true;
  });

  expect(writeComplete).toBe(false);
  expect(resampler.resumeTransform).toEqual(expect.any(Function));
  while (resampler.read() !== null) {}
  expect(writeComplete).toBe(true);
});
