# Usage

## Requirements

Use Node.js 26 or later. Provide signed 16-bit little-endian PCM data.

## Install

Run this command in your project:

```sh
npm install @eliware/resampler
```

## Convert audio

Import `Resampler`. Set the input and output sample rates. Pipe an input stream through the resampler and into an output stream.

```js
import { Resampler } from "@eliware/resampler";
import { createReadStream, createWriteStream } from "node:fs";

const resampler = new Resampler({
  inRate: 48000,
  outRate: 24000,
  inChannels: 2,
  outChannels: 1,
});

createReadStream("input.s16le").pipe(resampler).pipe(createWriteStream("output.s16le"));
```

The example changes 48 kHz stereo audio to 24 kHz mono audio. The resampler uses a Transform stream. It accepts Buffer chunks and writes Buffer chunks.

## Control output level

Set `volume` to change the output level. A value of `0.5` halves the level. A value of `0` makes silence. A negative value reverses signal polarity.

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

## Package contents

The npm package contains `src/`, `docs/`, `examples/`, and `specs/`. It also contains `README.md`, `AGENTS.md`, `LICENSE`, and `RELEASE_NOTES.md`.

Import the public API from `@eliware/resampler`. Do not import files under `src/` from consumer code.

## Release limits

The package contains local audio processing code. The package does not capture or play audio. It does not access a network service.

Run `npm run pack` in a source checkout to inspect package contents. Publish only after the project owner approves the release.
