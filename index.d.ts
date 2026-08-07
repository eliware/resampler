import { Transform } from 'stream';

/**
 * Options for Resampler
 */
export interface ResamplerOptions {
  /** Input sample rate; finite, greater than 0, and at most 1,000,000 (e.g. 48000) */
  inRate: number;
  /** Output sample rate; finite, greater than 0, and at most 1,000,000 (e.g. 24000) */
  outRate: number;
  /** Number of input channels (default: 1) */
  inChannels?: 1 | 2;
  /** Number of output channels (default: 1) */
  outChannels?: 1 | 2;
  /** Positive integer filter window size for sinc interpolation, at most 4096 (default: 8) */
  filterWindow?: number;
  /** Finite output volume multiplier (default: 1.0); negative values invert polarity */
  volume?: number;
}

/**
 * A high-quality PCM resampler implementing a windowed-sinc filter in pure JavaScript.
 * Processes 16-bit signed little-endian samples (s16le).
 */
export class Resampler extends Transform {
  /**
   * @param options Configuration for sample-rate conversion, channel mapping, and volume
   */
  constructor(options: ResamplerOptions);
}
