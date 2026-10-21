# AGENTS.md

## Project

Eliware maintains `@eliware/resampler`, a Node.js library for PCM audio resampling.
Use Node.js 26 or later. Use native ESM.

## Scope and boundaries

Keep repository requirements in `specs/directives.yaml`.

## Layout

Keep library code in `src/` and tests in `tests/`. Keep user guides in `docs/` and index them in `docs/README.md`.

## Development

Give each source and test module one cohesive purpose.

## Validation

Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.
Run `npm run format` to format files.
Run `npm run format:check` to check formatting.
Run `npm run typecheck` to check TypeScript declarations.

## Security

Keep credentials, private data, and runtime data out of Git.

## Changes

Keep public documentation current with maintained code. Keep `specs/directives.yaml` current.

## Library

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.
Run `npm run benchmark -- 48000 5` to measure conversion speed.

## npm publication

Run `npm run pack` before release. Use the Operations release handoff before publication.
