import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { Resampler } from './index.mjs';

function collect(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', c => chunks.push(c));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

test('downsamples 48kHz stereo to 24kHz mono', async () => {
  const inputPath = path.resolve('input-48k-stereo.s16le');
  const inBuf = fs.readFileSync(inputPath);
  const resampler = new Resampler({ inRate: 48000, outRate: 24000, inChannels: 2, outChannels: 1 });
  const outBuf = await collect(fs.createReadStream(inputPath).pipe(resampler));
  const expected = inBuf.length * (24000 * 1) / (48000 * 2);
  const tolerance = 128; // bytes, up to 64 samples
  expect(Math.abs(outBuf.length - expected)).toBeLessThanOrEqual(tolerance);
});

test('upsamples 24kHz mono to 48kHz stereo', async () => {
  const inputPath = path.resolve('input-24k-mono.s16le');
  const inBuf = fs.readFileSync(inputPath);
  const resampler = new Resampler({ inRate: 24000, outRate: 48000, inChannels: 1, outChannels: 2 });
  const outBuf = await collect(fs.createReadStream(inputPath).pipe(resampler));
  const expected = inBuf.length * (48000 * 2) / (24000 * 1);
  const tolerance = 128; // bytes, up to 64 samples
  expect(Math.abs(outBuf.length - expected)).toBeLessThanOrEqual(tolerance);
});

test('volume option reduces amplitude', async () => {
  const inputPath = path.resolve('input-24k-mono.s16le');
  const inBuf = fs.readFileSync(inputPath);
  // Use volume 0.5
  const resampler = new Resampler({ inRate: 24000, outRate: 24000, inChannels: 1, outChannels: 1, volume: 0.5 });
  const outBuf = await collect(fs.createReadStream(inputPath).pipe(resampler));
  // Check that the max absolute value is about half the input's max
  function maxAbsPCM16(buf) {
    let max = 0;
    for (let i = 0; i < buf.length; i += 2) {
      const v = buf.readInt16LE(i);
      max = Math.max(max, Math.abs(v));
    }
    return max;
  }
  const inMax = maxAbsPCM16(inBuf);
  const outMax = maxAbsPCM16(outBuf);
  // Allow a little tolerance for rounding
  expect(outMax).toBeGreaterThan(0);
  expect(outMax).toBeLessThanOrEqual(Math.ceil(inMax * 0.51));
  expect(outMax).toBeGreaterThanOrEqual(Math.floor(inMax * 0.49));
});


test('produces identical output regardless of input chunk boundaries', async () => {
  const input = Buffer.alloc(2 * 4096);
  for (let i = 0; i < 4096; i++) input.writeInt16LE(Math.round(Math.sin(i / 17) * 12000), i * 2);

  const options = { inRate: 44100, outRate: 48000 };
  const oneChunk = await collect(new Resampler(options).end(input));

  const resampler = new Resampler(options);
  const split = collect(resampler);
  resampler.write(input.subarray(0, 1));
  resampler.write(input.subarray(1, 257));
  resampler.write(input.subarray(257, 8193));
  resampler.end(input.subarray(8193));
  const manyChunks = await split;

  expect(manyChunks).toEqual(oneChunk);
});


test('handles chunks split at arbitrary byte boundaries', async () => {
  const input = Buffer.alloc(2 * 32);
  for (let i = 0; i < 32; i++) input.writeInt16LE(i * 100, i * 2);
  const resampler = new Resampler({ inRate: 24000, outRate: 24000 });
  const chunks = [];
  resampler.on('data', chunk => chunks.push(chunk));
  const ended = new Promise((resolve, reject) => {
    resampler.on('end', resolve);
    resampler.on('error', reject);
  });
  resampler.write(input.subarray(0, 1));
  resampler.write(input.subarray(1, 17));
  resampler.end(input.subarray(17));
  await ended;
  expect(Buffer.concat(chunks).length).toBeGreaterThan(0);
});

test('rejects an incomplete final PCM frame', async () => {
  const resampler = new Resampler({ inRate: 24000, outRate: 24000 });
  const error = new Promise(resolve => resampler.once('error', resolve));
  resampler.end(Buffer.from([0]));
  await expect(error).resolves.toBeInstanceOf(Error);
});


test.each([
  ['inRate', { inRate: 0, outRate: 24000 }],
  ['outRate', { inRate: 24000, outRate: Infinity }],
  ['inChannels', { inRate: 24000, outRate: 24000, inChannels: 3 }],
  ['outChannels', { inRate: 24000, outRate: 24000, outChannels: 0 }],
  ['filterWindow', { inRate: 24000, outRate: 24000, filterWindow: 2.5 }],
  ['volume', { inRate: 24000, outRate: 24000, volume: NaN }],
])('rejects invalid %s', (_, options) => {
  expect(() => new Resampler(options)).toThrow(TypeError);
});


test('uses an anti-alias cutoff when downsampling', () => {
  const downsampler = new Resampler({ inRate: 48000, outRate: 24000 });
  const upsampler = new Resampler({ inRate: 24000, outRate: 48000 });
  expect(downsampler.cutoff).toBe(0.5);
  expect(upsampler.cutoff).toBe(1);
});

test('preserves DC level through resampling', async () => {
  const input = Buffer.alloc(2 * 256);
  for (let i = 0; i < 256; i++) input.writeInt16LE(10000, i * 2);
  const resampler = new Resampler({ inRate: 48000, outRate: 24000 });
  const outBuf = await collect(resampler.end(input));
  const values = [];
  for (let i = 16; i < outBuf.length / 2 - 16; i++) values.push(outBuf.readInt16LE(i * 2));
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  expect(mean).toBeGreaterThan(9900);
  expect(mean).toBeLessThan(10100);
});

test('attenuates frequencies above the downsampling Nyquist limit', async () => {
  const input = Buffer.alloc(2 * 2048);
  for (let i = 0; i < 2048; i++) {
    const sample = Math.round(Math.sin(2 * Math.PI * 18000 * i / 48000) * 12000);
    input.writeInt16LE(sample, i * 2);
  }
  const resampler = new Resampler({ inRate: 48000, outRate: 24000 });
  const outBuf = await collect(resampler.end(input));
  let peak = 0;
  for (let i = 32; i < outBuf.length / 2 - 32; i++) peak = Math.max(peak, Math.abs(outBuf.readInt16LE(i * 2)));
  expect(peak).toBeLessThan(1200);
});
