import { once } from 'node:events';
import { Resampler } from './index.mjs';

const frames = Number(process.argv[2] ?? 48000 * 10);
const input = Buffer.alloc(frames * 2);
for (let i = 0; i < frames; i++) input.writeInt16LE(Math.sin(i / 17) * 12000, i * 2);

const options = { inRate: 48000, outRate: 44100 };
const start = process.hrtime.bigint();
const resampler = new Resampler(options);
const chunks = [];
resampler.on('data', chunk => chunks.push(chunk));
resampler.end(input);
await once(resampler, 'end');
const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;

console.log(JSON.stringify({
  frames,
  outputBytes: Buffer.concat(chunks).length,
  elapsedMs: Number(elapsedMs.toFixed(2)),
  inputSeconds: frames / options.inRate,
  realtimeFactor: Number(((frames / options.inRate) / (elapsedMs / 1000)).toFixed(2)),
}, null, 2));
