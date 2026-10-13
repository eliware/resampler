# Release Notes

## 12.0.0 — 2026-10-13

### Added

- Added user guides for installation, API options, PCM layout, and common faults.
- Added indexes for guides, examples, and specifications.
- Added CI, npm publish, and Knit deploy workflows.
- Added repository guidance and a local specification.
- Added tests for PCM input, PCM output, stream transforms, and stream flush behavior.

### Changed

- Set the package version and metadata to 12.0.0 and updated the development dependencies.
- Use `@eliware/test` for package validation and require 100% code coverage.
- Moved the public entrypoint and type declarations into `src/`.
- Split PCM input, PCM output, filter, channel, validation, transform, and flush work into focused modules.
- Added matching tests for the focused modules. Kept stream integration tests with the stream module.
- Moved the benchmark and type-check fixture into their current directories.
- Updated the README, benchmark guide, examples, package files, and repository guidance.
- Replaced the old Node.js workflow with separate validation and publish workflows.
- Updated the license copyright notice to Eliware, 2026.

### Fixed

- Corrected documentation links and added indexes for each content area.
- Corrected PCM output so negative full scale encodes as -32768.
- Formatted maintained files with the shared package rules.

## 1.1.3 — 2026-08-07

### Changed

Version 1.1.3 added package metadata, published files, CI checks, docs, examples, and validation for Eliware library rules.

### Fixed

The release removed the legacy `main` entry and tests from the npm package.

## 1.1.2 — 2026-08-07

### Added

Version 1.1.2 added anti-alias filtering, a coefficient cache, input limits, mono and stereo maps, volume control, declarations, examples, benchmark code, and tests.

### Changed

The release split the resampler into ESM modules. It removed the `@eliware/common` runtime dependency and CommonJS entrypoints.

## 1.1.1 — 2025-12-09

### Added

Version 1.1.1 was the first release of the resampler package.
