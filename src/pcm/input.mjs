export function readPcmInput(resampler, chunk) {
  if (!chunk.length) return 0;
  const input = Buffer.isBuffer(chunk)
    ? chunk
    : Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
  const frameBytes = 2 * resampler.inChannels;
  let offset = 0;
  let completeBytes = 0;
  if (resampler.pending.length) {
    const needed = frameBytes - resampler.pending.length;
    if (input.length < needed) {
      resampler.pending = Buffer.concat([resampler.pending, input]);
      return 0;
    }
    const frame = Buffer.allocUnsafe(frameBytes);
    resampler.pending.copy(frame);
    input.copy(frame, resampler.pending.length, 0, needed);
    readFrame(resampler, new DataView(frame.buffer, frame.byteOffset, frame.byteLength), 0);
    resampler.pending = Buffer.alloc(0);
    offset = needed;
    completeBytes = frameBytes;
  }

  const remainingBytes = input.length - offset;
  const chunkBytes = remainingBytes - (remainingBytes % frameBytes);
  const completeInput = input.subarray(offset, offset + chunkBytes);
  const view = new DataView(
    completeInput.buffer,
    completeInput.byteOffset,
    completeInput.byteLength,
  );
  for (let i = 0; i < chunkBytes / frameBytes; i++) {
    readFrame(resampler, view, i * frameBytes);
  }
  completeBytes += chunkBytes;
  resampler.pending = Buffer.from(input.subarray(offset + chunkBytes));
  return completeBytes;
}

function readFrame(resampler, view, frameOffset) {
  for (let ch = 0; ch < resampler.inChannels; ch++) {
    const value = view.getInt16(frameOffset + ch * 2, true);
    resampler.buffers[ch].push(value / 32768);
  }
}
