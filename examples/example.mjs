import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { Resampler } from "@eliware/resampler";

function createPcm(frameCount, channelCount) {
  const pcm = Buffer.alloc(frameCount * channelCount * 2);

  for (let frame = 0; frame < frameCount; frame += 1) {
    const sample = Math.round(Math.sin((frame * 2 * Math.PI) / 48) * 12000);

    for (let channel = 0; channel < channelCount; channel += 1) {
      pcm.writeInt16LE(sample, (frame * channelCount + channel) * 2);
    }
  }

  return pcm;
}

async function convert(input, options, outputPath) {
  const resampler = new Resampler(options);
  await pipeline(Readable.from([input]), resampler, createWriteStream(outputPath));
}

async function run() {
  const outputDirectory = resolve(process.argv[2] ?? "resampler-example-output");
  const input48Stereo = createPcm(4800, 2);
  const input24Mono = createPcm(2400, 1);
  const output24Mono = join(outputDirectory, "output-24k-mono.s16le");
  const output48Stereo = join(outputDirectory, "output-48k-stereo.s16le");
  const output24MonoQuiet = join(outputDirectory, "output-24k-mono-quiet.s16le");

  await mkdir(outputDirectory, { recursive: true });

  console.log("Resampling 48 kHz stereo to 24 kHz mono...");
  await convert(
    input48Stereo,
    { inRate: 48000, outRate: 24000, inChannels: 2, outChannels: 1 },
    output24Mono,
  );
  console.log("Downsample complete:", output24Mono);

  console.log("Resampling 24 kHz mono to 48 kHz stereo...");
  await convert(
    input24Mono,
    { inRate: 24000, outRate: 48000, inChannels: 1, outChannels: 2 },
    output48Stereo,
  );
  console.log("Upsample complete:", output48Stereo);

  console.log("Resampling 48 kHz stereo to 24 kHz mono at half volume...");
  await convert(
    input48Stereo,
    { inRate: 48000, outRate: 24000, inChannels: 2, outChannels: 1, volume: 0.5 },
    output24MonoQuiet,
  );
  console.log("Downsample at half volume complete:", output24MonoQuiet);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
