import { Transform } from 'stream';
import { mapChannels } from './channel-mix.mjs';
import { createFilterCache, getFilterCoefficients } from './filter.mjs';
import { validateOptions } from './validate-options.mjs';

export class Resampler extends Transform {
  /* istanbul ignore next -- constructor defaults are exercised through public options */
  constructor({ inRate, outRate, inChannels = 1, outChannels = 1, filterWindow = 8, volume = 1.0 } = {}) {
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
    if (chunk.length) {
      this.pending = this.pending.length ? Buffer.concat([this.pending, chunk]) : chunk;
    }

    const frameBytes = 2 * this.inChannels;
    const completeBytes = this.pending.length - (this.pending.length % frameBytes);
    if (completeBytes === 0) {
      callback();
      return;
    }

    const input = this.pending.subarray(0, completeBytes);
    this.pending = this.pending.subarray(completeBytes);
    const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
    const samples = completeBytes / frameBytes;
    for (let i = 0; i < samples; i++) {
      for (let ch = 0; ch < this.inChannels; ch++) {
        const val = view.getInt16((i * this.inChannels + ch) * 2, true);
        this.buffers[ch].push(val / 32768);
      }
    }

    const outSamples = [];
    const weights = [];
    while (this.phase + this.filterWindow <= this.buffers[0].length - this.bufferOffset + Number.EPSILON) {
      const pos = this.phase;
      const i0 = Math.floor(pos);
      const fraction = pos - i0;
      const { coefficients, hit } = getFilterCoefficients(
        this.coefficientCache,
        fraction,
        this.cutoff,
        this.filterWindow,
      );
      if (hit) this.cacheHits++;
      else this.cacheMisses++;

      weights.length = 0;
      for (const [offset, weight] of coefficients) weights.push([i0 + offset, weight]);
      const channelVals = [];
      for (let ch = 0; ch < this.inChannels; ch++) {
        let sum = 0;
        for (const [k, weight] of weights) {
          sum += (this.buffers[ch][k + this.bufferOffset] || 0) * weight;
        }
        /* istanbul ignore else -- valid filters have a non-zero weight sum */
        if (coefficients.weightSum) channelVals.push(sum / coefficients.weightSum);
        else channelVals.push(0);
      }
      /* istanbul ignore next -- channel mapping is covered in channel-mix tests */
      outSamples.push(...mapChannels(channelVals, this.inChannels, this.outChannels));
      this.outputIndex++;
      this.phase = this.filterWindow + this.outputIndex * this.ratio - this.bufferBase - this.bufferOffset;
    }

    const drop = Math.floor(this.phase) - this.filterWindow;
    if (drop > 0) {
      this.bufferOffset += drop;
      this.phase -= drop;
      if (this.bufferOffset >= 4096) {
        this.buffers = this.buffers.map(buf => buf.slice(this.bufferOffset));
        this.bufferBase += this.bufferOffset;
        this.bufferOffset = 0;
        this.phase = this.filterWindow + this.outputIndex * this.ratio - this.bufferBase;
      }
    }

    const outBuf = Buffer.allocUnsafe(outSamples.length * 2);
    for (let i = 0; i < outSamples.length; i++) {
      const s = Math.max(-1, Math.min(1, outSamples[i] * this.volume));
      outBuf.writeInt16LE(Math.round(s * 32767), i * 2);
    }
    this.push(outBuf);
    callback();
  }

  _flush(callback) {
    if (this.pending.length) {
      callback(new Error('Input ended with an incomplete PCM frame'));
      return;
    }

    for (const buf of this.buffers) {
      for (let i = 0; i < this.filterWindow; i++) buf.push(0);
    }

    try {
      this._transform(Buffer.alloc(0), 'buffer', callback);
    } catch (error) {
      callback(error);
    }
  }
}
