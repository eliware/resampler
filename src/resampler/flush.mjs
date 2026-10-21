export function flushResampler(resampler, callback) {
  if (resampler.pending.length) {
    resampler.logger.warn("Resampler input ended with an incomplete frame", {
      component: "@eliware/resampler",
      event: "resampler.incomplete_frame",
      pendingBytes: resampler.pending.length,
      inChannels: resampler.inChannels,
    });
    callback(new Error("Input ended with an incomplete PCM frame"));
    return;
  }

  for (const buf of resampler.buffers) {
    for (let i = 0; i < resampler.filterWindow; i++) buf.push(0);
  }

  try {
    resampler._transform(Buffer.alloc(0), "buffer", (error) => {
      if (error) {
        resampler.logger.error("Resampler flush failed", {
          component: "@eliware/resampler",
          event: "resampler.flush_failed",
          errorType: error.name,
        });
        callback(error);
        return;
      }
      resampler.logger.info("Resampler flushed", {
        component: "@eliware/resampler",
        event: "resampler.flushed",
        inRate: resampler.inRate,
        outRate: resampler.outRate,
        inChannels: resampler.inChannels,
        outChannels: resampler.outChannels,
        outputFrames: resampler.outputIndex,
      });
      callback();
    });
  } catch (error) {
    resampler.logger.error("Resampler flush failed", {
      component: "@eliware/resampler",
      event: "resampler.flush_failed",
      errorType: error.name,
    });
    callback(error);
  }
}
