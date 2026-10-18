export function readPcmInput(resampler, chunk) {
  if (chunk.length) {
    resampler.pending = resampler.pending.length
      ? Buffer.concat([resampler.pending, chunk])
      : chunk;
  }

  const frameBytes = 2 * resampler.inChannels;
  const completeBytes = resampler.pending.length - (resampler.pending.length % frameBytes);
  const input = resampler.pending.subarray(0, completeBytes);
  resampler.pending = resampler.pending.subarray(completeBytes);
  const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
  const samples = completeBytes / frameBytes;
  for (let i = 0; i < samples; i++) {
    for (let ch = 0; ch < resampler.inChannels; ch++) {
      const value = view.getInt16((i * resampler.inChannels + ch) * 2, true);
      resampler.buffers[ch].push(value / 32768);
    }
  }
  return completeBytes;
}
