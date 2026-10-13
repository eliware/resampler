import { mapChannels } from "./channel-mix.mjs";
import { getFilterCoefficients } from "./filter.mjs";
import { readPcmInput } from "./pcm-input.mjs";
import { writePcmOutput } from "./pcm-output.mjs";

export function transformResampler(resampler, chunk, callback) {
  const completeBytes = readPcmInput(resampler, chunk);
  if (completeBytes === 0) {
    callback();
    return;
  }

  const outSamples = [];
  const weights = [];
  while (
    resampler.phase + resampler.filterWindow <=
    resampler.buffers[0].length - resampler.bufferOffset + Number.EPSILON
  ) {
    const pos = resampler.phase;
    const i0 = Math.floor(pos);
    const fraction = pos - i0;
    const { coefficients, hit } = getFilterCoefficients(
      resampler.coefficientCache,
      fraction,
      resampler.cutoff,
      resampler.filterWindow,
    );
    if (hit) resampler.cacheHits++;
    else resampler.cacheMisses++;

    weights.length = 0;
    for (const [offset, weight] of coefficients) weights.push([i0 + offset, weight]);
    const channelVals = [];
    for (let ch = 0; ch < resampler.inChannels; ch++) {
      let sum = 0;
      for (const [k, weight] of weights) {
        sum += (resampler.buffers[ch][k + resampler.bufferOffset] || 0) * weight;
      }
      channelVals.push(sum / coefficients.weightSum);
    }
    outSamples.push(...mapChannels(channelVals, resampler.inChannels, resampler.outChannels));
    resampler.outputIndex++;
    resampler.phase =
      resampler.filterWindow +
      resampler.outputIndex * resampler.ratio -
      resampler.bufferBase -
      resampler.bufferOffset;
  }

  const drop = Math.floor(resampler.phase) - resampler.filterWindow;
  if (drop > 0) {
    resampler.bufferOffset += drop;
    resampler.phase -= drop;
    if (resampler.bufferOffset >= 4096) {
      resampler.buffers = resampler.buffers.map((buf) => buf.slice(resampler.bufferOffset));
      resampler.bufferBase += resampler.bufferOffset;
      resampler.bufferOffset = 0;
      resampler.phase =
        resampler.filterWindow + resampler.outputIndex * resampler.ratio - resampler.bufferBase;
    }
  }

  resampler.push(writePcmOutput(resampler, outSamples));
  callback();
}
