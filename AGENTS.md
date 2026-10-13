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

Document the API, supported use, install steps, options, and package contents in README.md and docs/.

## npm publication

Include specs/ in the package. Run `npm run pack` before release.
