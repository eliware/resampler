# AGENTS.md

## Project

`@eliware/resampler` is an ESM Node.js package for streaming s16le PCM resampling.

## Structure

- `index.mjs`: public barrel export only.
- `src/resampler.mjs`: Transform stream, PCM buffering, resampling state, output encoding.
- `src/filter.mjs`: sinc/Lanczos coefficients and bounded coefficient cache.
- `src/channel-mix.mjs`: mono/stereo channel mapping.
- `src/validate-options.mjs`: constructor option validation.
- `index.test.mjs`: integration and DSP behavior tests.
- `typecheck.mts`: TypeScript declaration smoke test.
- `benchmark.mjs`: repeatable performance benchmark.

## Development

Use focused validation during changes:

```sh
npm test
npm run typecheck
npm run lint
npm pack --dry-run
```

Benchmark streaming workloads:

```sh
npm run benchmark -- 48000 5 960
```

## Rules

- Preserve s16le little-endian behavior and stream chunk-boundary equivalence.
- Keep channel support limited to mono/stereo unless API changes are intentional.
- Add regression tests for behavior changes and edge cases.
- Keep DSP output stable; benchmark and inspect output when optimizing.
- Keep modules single-purpose.
- Do not publish, tag, push, or deploy unless explicitly requested.
- Release workflow is npm-publishing only; custom Knit CI handles normal validation.
