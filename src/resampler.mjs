import { Transform } from "stream";
import { createFilterCache } from "./filter.mjs";
import { transformResampler } from "./resampler/transform.mjs";
import { flushResampler } from "./resampler/flush.mjs";
import { validateOptions } from "./validate-options.mjs";

export class Resampler extends Transform {
  constructor({
    inRate,
    outRate,
    inChannels = 1,
    outChannels = 1,
    filterWindow = 8,
    volume = 1.0,
  } = {}) {
    validateOptions({ inRate, outRate, inChannels, outChannels, filterWindow, volume });

    super();
    this.inRate = inRate;
    this.outRate = outRate;
    this.inChannels = inChannels;
    this.outChannels = outChannels;
    this.filterWindow = filterWindow;
    this.ratio = inRate / outRate;
    this.cutoff = Math.min(1, outRate / inRate);
    this.phase = filterWindow;
    this.outputIndex = 0;
    this.bufferBase = 0;
    this.buffers = Array.from({ length: inChannels }, () => []);
    this.bufferOffset = 0;
    this.volume = volume;
    this.pending = Buffer.alloc(0);
    this.coefficientCache = createFilterCache();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  _transform(chunk, encoding, callback) {
    transformResampler(this, chunk, callback);
  }

  _flush(callback) {
    flushResampler(this, callback);
  }
}
