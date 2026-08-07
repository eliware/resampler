import { Transform } from 'stream';

function sinc(x) {
  if (x === 0) return 1;
  return Math.sin(Math.PI * x) / (Math.PI * x);
}

function lanczosWindow(x, a) {
  return Math.abs(x) > a ? 0 : sinc(x / a);
}

export class Resampler extends Transform {
  constructor({ inRate, outRate, inChannels = 1, outChannels = 1, filterWindow = 8, volume = 1.0 } = {}) {
    if (!Number.isFinite(inRate) || inRate <= 0) {
      throw new TypeError('inRate must be a finite number greater than 0');
    }
    if (!Number.isFinite(outRate) || outRate <= 0) {
      throw new TypeError('outRate must be a finite number greater than 0');
    }
    if (!Number.isInteger(inChannels) || ![1, 2].includes(inChannels)) {
      throw new TypeError('inChannels must be 1 or 2');
    }
    if (!Number.isInteger(outChannels) || ![1, 2].includes(outChannels)) {
      throw new TypeError('outChannels must be 1 or 2');
    }
    if (!Number.isInteger(filterWindow) || filterWindow <= 0) {
      throw new TypeError('filterWindow must be a positive integer');
    }
    if (!Number.isFinite(volume)) {
      throw new TypeError('volume must be a finite number');
    }

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
    this.coefficientCache = new Map();
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
      const cacheKey = fraction.toString();
      let coefficients = this.coefficientCache.get(cacheKey);
      if (coefficients) this.cacheHits++;
      if (!coefficients) {
        this.cacheMisses++;
        coefficients = [];
        let weightSum = 0;
        for (let offset = -this.filterWindow + 1; offset <= this.filterWindow; offset++) {
          const x = fraction - offset;
          const weight = this.cutoff * sinc(this.cutoff * x) * lanczosWindow(x, this.filterWindow);
          coefficients.push([offset, weight]);
          weightSum += weight;
        }
        coefficients.weightSum = weightSum;
        if (this.coefficientCache.size < 4096) this.coefficientCache.set(cacheKey, coefficients);
      }
      weights.length = 0;
      for (const [offset, weight] of coefficients) weights.push([i0 + offset, weight]);
      const weightSum = coefficients.weightSum;

      const channelVals = [];
      for (let ch = 0; ch < this.inChannels; ch++) {
        let sum = 0;
        for (const [k, weight] of weights) {
          sum += (this.buffers[ch][k + this.bufferOffset] || 0) * weight;
        }
        channelVals.push(weightSum ? sum / weightSum : 0);
      }
      if (this.inChannels === 2 && this.outChannels === 1) {
        outSamples.push((channelVals[0] + channelVals[1]) / 2);
      } else if (this.inChannels === 1 && this.outChannels === 2) {
        outSamples.push(channelVals[0], channelVals[0]);
      } else {
        outSamples.push(...channelVals.slice(0, this.outChannels));
      }

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
      // Apply volume control here
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

    const pad = this.filterWindow;
    this.buffers.forEach(buf => {
      for (let i = 0; i < pad; i++) buf.push(0);
    });

    try {
      this._transform(Buffer.alloc(0), 'buffer', callback);
    } catch (error) {
      callback(error);
    }
  }
}
