# AGENTS.md

## Project

Use Node.js 26 or later. Use native ESM.

## Scope and boundaries

Keep public use details in README.md and docs/.

## Layout

Keep library modules in src/. Keep their tests in tests/. Index user guides in docs/README.md.

## Development

Keep each source module matched to one test module.

## Validation

Run `npm test` for all checks.

Run `npm run lint` for lint checks.

Run `npm run audit` for dependency checks.

Run `npm run format` to format files.

Run `npm run format:check` to check file format.

Run `npm run pack` to check package contents.

Run `npm run typecheck` to check TypeScript declarations.

## Security

Keep credentials and private data out of Git. Publish only after approved release steps.

## Changes

Keep public use details accurate. Keep specs/directives.yaml current.

## Library

- Run focused tests first during development.
- Run one test file with `npm test -- tests/path/to/example.test.mjs`.
- Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
- Prevent repeated full-suite runs during development.
- Run the full `npm test` suite for final validation before a commit, milestone, or release.
- Document the API, supported use, installation, options, and package contents in README.md and docs/.

## npm publication

Include specs/ in the package. Run `npm run pack` before release.
