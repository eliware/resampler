import { once } from 'node:events';
import { Resampler } from './index.mjs';

const frames = Number(process.argv[2] ?? 48000 * 10);
const repeats = Number(process.argv[3] ?? 5);
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
  const timings = [];
  let outputBytes;
  for (let run = 0; run < repeats; run++) {
    const start = process.hrtime.bigint();
    const resampler = new Resampler({ inRate, outRate, filterWindow });
    const chunks = [];
    resampler.on('data', chunk => chunks.push(chunk));
    resampler.end(input);
    await once(resampler, 'end');
    timings.push(Number(process.hrtime.bigint() - start) / 1e6);
    outputBytes = Buffer.concat(chunks).length;
  }
  timings.sort((a, b) => a - b);
  const medianMs = timings[Math.floor(timings.length / 2)];
  const inputSeconds = frames / inRate;

  console.log(JSON.stringify({
    frames,
    repeats,
    inRate,
    outRate,
    filterWindow,
    outputBytes,
    minMs: Number(timings[0].toFixed(2)),
    medianMs: Number(medianMs.toFixed(2)),
    maxMs: Number(timings.at(-1).toFixed(2)),
    medianRealtimeFactor: Number((inputSeconds / (medianMs / 1000)).toFixed(2)),
  }));
}
