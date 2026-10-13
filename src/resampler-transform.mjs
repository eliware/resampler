import { mapChannels } from "./channel-mix.mjs";
import { getFilterCoefficients } from "./filter.mjs";

export function transformResampler(resampler, chunk, callback) {
  if (chunk.length) {
    resampler.pending = resampler.pending.length
      ? Buffer.concat([resampler.pending, chunk])
      : chunk;
  }

  const frameBytes = 2 * resampler.inChannels;
  const completeBytes = resampler.pending.length - (resampler.pending.length % frameBytes);
  if (completeBytes === 0) {
    callback();
    return;
  }

  const input = resampler.pending.subarray(0, completeBytes);
  resampler.pending = resampler.pending.subarray(completeBytes);
  const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
  const samples = completeBytes / frameBytes;
  for (let i = 0; i < samples; i++) {
    for (let ch = 0; ch < resampler.inChannels; ch++) {
      const val = view.getInt16((i * resampler.inChannels + ch) * 2, true);
      resampler.buffers[ch].push(val / 32768);
    }
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

  const outBuf = Buffer.allocUnsafe(outSamples.length * 2);
  for (let i = 0; i < outSamples.length; i++) {
    const s = Math.max(-1, Math.min(1, outSamples[i] * resampler.volume));
    outBuf.writeInt16LE(Math.round(s * 32767), i * 2);
  }
  resampler.push(outBuf);
  callback();
}
