# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/resampler [![npm](https://img.shields.io/npm/v/@eliware/resampler)](https://www.npmjs.com/package/@eliware/resampler) [![License](https://img.shields.io/github/license/eliware/resampler)](https://github.com/eliware/resampler/blob/main/LICENSE) [![CI](https://github.com/eliware/resampler/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/resampler/actions/workflows/ci.yaml)

A pure JavaScript, high-quality PCM audio resampler for Node.js. Converts s16le PCM between arbitrary sample rates and channel layouts (mono/stereo) with windowed-sinc filtering.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [API](#api)
- [Packaging](#packaging)
- [Examples](#examples)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

Convert s16le PCM between sample rates with a windowed-sinc filter. Convert mono and stereo channels. Set output volume. Use the stream with Node.js pipelines.

## Requirements

Use Node.js 26 or later and npm 12 or later for repository validation. Supply signed 16-bit little-endian PCM input.

## Setup

Install the package with `npm install @eliware/resampler`.

## Usage

Create a `Resampler` Transform stream with input and output sample rates. Pipe s16le PCM data through the stream. Read [release notes](RELEASE_NOTES.md) for release history.

```js
import { Resampler } from "@eliware/resampler";
import fs from "node:fs";

const resampler = new Resampler({
  inRate: 48000,
  outRate: 24000,
  inChannels: 2,
  outChannels: 1,
});

fs.createReadStream("input.s16le").pipe(resampler).pipe(fs.createWriteStream("output.s16le"));
```

## Development

Read [AGENTS.md](AGENTS.md) before you change files. Use the [docs index](docs/README.md), [specifications index](specs/README.md), and [examples index](examples/README.md) to find project guidance.

## Testing

Run `npm test` for repository validation. Run `npm run pack` to check package contents.

## Troubleshooting

Run `npm ci` after dependency changes. Read [troubleshooting](docs/troubleshooting.md) when validation reports an error.

## Security

The package processes audio data locally. Validate untrusted file paths. Do not expose private audio in logs or generated files.

## API

`Resampler(options)` creates a Transform stream. Set `inRate` and `outRate`. Set `inChannels` and `outChannels` to `1` or `2`. Set `filterWindow` to a positive integer from `1` to `4096`. Set finite `volume` to scale output.

The stream accepts complete s16le frames. It buffers incomplete frames between chunks. It reports an error if the final frame is incomplete. The filter adds edge latency and can change output length.

## Packaging

The package includes `src/`, `docs/`, `examples/`, and `specs/`, plus package metadata and guidance files. Run `npm run pack` to check package contents. Publish only after approved release steps.

## Examples

Run `node examples/example.mjs` to convert the sample files. Read [example guidance](examples/README.md) before you run it.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/resampler)
- [Bug Reports](https://github.com/eliware/resampler/issues)
- [npm](https://www.npmjs.com/package/@eliware/resampler)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
