import { once } from 'node:events';
import { Resampler } from './index.mjs';

const frames = Number(process.argv[2] ?? 48000 * 10);
const input = Buffer.alloc(frames * 2);
for (let i = 0; i < frames; i++) input.writeInt16LE(Math.sin(i / 17) * 12000, i * 2);

const cases = [
  [48000, 44100, 4],
  [48000, 44100, 8],
  [48000, 44100, 16],
  [48000, 24000, 8],
  [24000, 48000, 8],
];

for (const [inRate, outRate, filterWindow] of cases) {
  const start = process.hrtime.bigint();
  const resampler = new Resampler({ inRate, outRate, filterWindow });
  const chunks = [];
  resampler.on('data', chunk => chunks.push(chunk));
  resampler.end(input);
  await once(resampler, 'end');
  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
  const inputSeconds = frames / inRate;

  console.log(JSON.stringify({
    frames,
    inRate,
    outRate,
    filterWindow,
    outputBytes: Buffer.concat(chunks).length,
    elapsedMs: Number(elapsedMs.toFixed(2)),
    realtimeFactor: Number((inputSeconds / (elapsedMs / 1000)).toFixed(2)),
  }));
}
