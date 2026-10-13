import * as entrypoint from "../src/index.mjs";
import { Resampler } from "../src/resampler.mjs";

test("exports Resampler from the package entrypoint", () => {
  expect(entrypoint.Resampler).toBe(Resampler);
});
