export function writePcmOutput(resampler, samples) {
  const output = Buffer.allocUnsafe(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const value = Math.max(-1, Math.min(1, samples[i] * resampler.volume));
    output.writeInt16LE(Math.round(value * (value < 0 ? 32768 : 32767)), i * 2);
  }
  return output;
}
