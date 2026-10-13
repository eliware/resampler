# AGENTS.md

## Project

Build the Eliware PCM resampler library with Node.js 26 or later and native ESM.

## Scope and boundaries

This repository owns PCM sample-rate conversion for Node.js. It does not own audio capture, playback, or external services.

## Layout

Keep runtime modules under `src/` and tests under `tests/`. Keep user documentation under `docs/`, examples under `examples/`, and specifications under `specs/`.

## Development

Keep source and test modules focused. Mirror each `src/*.mjs` module with one test at the same path under `tests/`. Keep each source file at or below 100 lines and each test file at or below 200 lines.

## Validation

Use Node.js 26 or later and npm 12 or later. Use native ESM for maintained JavaScript modules. Run `npm test` for aggregate validation. Run `npm run lint`, `npm run audit`, `npm run format`, `npm run format:check`, and `npm run pack` for their named checks.

## Security

Keep credentials, secret values, private data, and runtime state out of Git. Validate untrusted file paths and do not expose sensitive audio in logs or generated files.

## Changes

Keep documentation and examples aligned with the public API. Follow shared conventions. Run required validation before you commit.

## Library

Document supported PCM formats, rates, channels, options, stream behavior, declarations, and package contents in README.md. Test public behavior and observable stream output.

## npm publication

The public package is `@eliware/resampler`. Include `src/`, `docs/`, `examples/`, and `specs/` in the package. Run `npm run pack` before publication. Follow approved release steps.
