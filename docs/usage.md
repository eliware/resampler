# Usage

## Requirements

Use Node.js 26 or later. Provide signed 16-bit little-endian PCM data without a header.
Set the input options to match the PCM data. The package does not decode audio files such as WAV or MP3.

## Install

Run this command in your project:

```sh
npm install @eliware/resampler
```

## Convert audio

Import `Resampler`. Set the input and output sample rates and channel counts. Use `pipeline` to pass data through the resampler and report stream errors.

```js
import { Resampler } from "@eliware/resampler";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const resampler = new Resampler({
  inRate: 48000,
  outRate: 24000,
  inChannels: 2,
  outChannels: 1,
});

await pipeline(createReadStream("input.s16le"), resampler, createWriteStream("output.s16le"));
```

This example converts 48 kHz stereo input to 24 kHz mono output. The file must contain raw s16le PCM. The resampler accepts `Buffer` chunks and writes `Buffer` chunks.

The stream can split a PCM frame across input chunks. It keeps the remaining bytes until a later chunk. It reports an error when the final chunk ends inside a frame.

## Run the conversion example

Read the [example guidance](../examples/README.md) to run the conversion example from a checkout or an installed package. The example creates sample PCM data in memory and writes three output files under `resampler-example-output/` in the current directory. Use the first argument to name the output directory.

## Control output level

Set `volume` to change the output level. A value of `0.5` halves the level. A value of `0` sets each output sample to `0`. A negative value changes signal polarity.

```js
const resampler = new Resampler({
  inRate: 48000,
  outRate: 24000,
  inChannels: 2,
  outChannels: 1,
  volume: 0.5,
});
```

The resampler clips output to the signed 16-bit range. Read the [API guide](api.md) for all options.

## Set a logger

Install `@eliware/log` when your application needs to create a logger. Pass the logger through the `logger` option.

```sh
npm install @eliware/log
```

```js
import { createLogger } from "@eliware/log";
import { Resampler } from "@eliware/resampler";

const logger = createLogger({ level: "info", format: "json" });
const resampler = new Resampler({ inRate: 48000, outRate: 24000, logger });
```

The default logger writes no records. The resampler records operation details, but it does not record audio data or error messages. Do not add credentials or private data to custom logger metadata.
Read the [API guide](api.md#logging) for event names and levels.

## Package contents

The npm package contains `src/`, `docs/`, `examples/`, and `specs/`. It also contains `README.md`, `AGENTS.md`, `LICENSE`, and `RELEASE_NOTES.md`.

Import the public API from `@eliware/resampler`. Do not import files under `src/` from consumer code.

## Release limits

The package processes PCM data that your application supplies. It does not capture or play audio. It does not connect to a network.

Run `npm run pack` in a source checkout to inspect package contents. Use the approved Operations release handoff before publication.
