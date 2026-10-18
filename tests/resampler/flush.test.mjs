import { flushResampler } from "../../src/resampler/flush.mjs";
import { Resampler } from "../../src/resampler.mjs";

test("flushes the filter tail", () => {
  const resampler = new Resampler({ inRate: 24000, outRate: 24000, filterWindow: 1 });
  let callbackArgs;
  const callback = (...args) => {
    callbackArgs = args;
  };

  flushResampler(resampler, callback);

  expect(callbackArgs).toEqual([]);
  expect(resampler.buffers[0]).toEqual([0]);
});

test("reports an incomplete final frame", () => {
  const resampler = new Resampler({ inRate: 24000, outRate: 24000 });
  resampler.pending = Buffer.from([0]);
  let callbackArgs;
  const callback = (...args) => {
    callbackArgs = args;
  };

  flushResampler(resampler, callback);

  expect(callbackArgs[0]).toBeInstanceOf(Error);
});

test("reports errors from the final transform", () => {
  const resampler = new Resampler({ inRate: 24000, outRate: 24000 });
  resampler._transform = () => {
    throw new Error("flush failure");
  };
  let callbackArgs;
  const callback = (...args) => {
    callbackArgs = args;
  };

  flushResampler(resampler, callback);

  expect(callbackArgs[0]).toBeInstanceOf(Error);
  expect(callbackArgs[0].message).toBe("flush failure");
});
