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

Convert s16le PCM between sample rates. Convert mono input to stereo output or stereo input to mono output. Set output volume.

## Requirements

Use Node.js 26 or later. Supply signed 16-bit little-endian PCM data.

## Setup

Install the package with `npm install @eliware/resampler`.

## Usage

Create a `Resampler` stream. Pipe s16le PCM data through it. Read the [user guide](docs/usage.md) and [release notes](RELEASE_NOTES.md).

## Development

Use the [documentation index](docs/README.md), [specifications index](specs/README.md), and [examples index](examples/README.md).

## Testing

Run `npm test` for all checks. Run `npm run pack` to check package contents.

## Troubleshooting

Read the [troubleshooting guide](docs/troubleshooting.md) when output or validation fails.

## Security

Validate untrusted file paths. Keep private audio out of logs and generated files.

## API

Read the [API guide](docs/api.md) for options, frame rules, channel maps, and output behavior.

## Packaging

The package includes `src/`, `docs/`, `examples/`, and `specs/`. Read the [package guide](docs/usage.md#package-contents). Publish only after approved release steps.

## Examples

Run `node examples/example.mjs`. Read [example guidance](examples/README.md).

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
