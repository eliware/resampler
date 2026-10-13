export function flushResampler(resampler, callback) {
  if (resampler.pending.length) {
    callback(new Error("Input ended with an incomplete PCM frame"));
    return;
  }

  for (const buf of resampler.buffers) {
    for (let i = 0; i < resampler.filterWindow; i++) buf.push(0);
  }

  try {
    resampler._transform(Buffer.alloc(0), "buffer", callback);
  } catch (error) {
    callback(error);
  }
}
