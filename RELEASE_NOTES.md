# Release Notes

## 12.0.0 — 2026-10-13

### Added

This release adds user guides for setup, API options, PCM layout, and common faults. It also adds v12 CI, publish, and Knit workflows. It adds repository guidance and a local specification.

### Changed

The package version and metadata now follow v12 rules. Validation now runs through `@eliware/test`. Development dependencies now use updated releases. The public entrypoint and declarations now live under `src/`.

Separate source modules now handle stream work. Matching tests cover each module. Coverage checks require 100% for all four metrics. Shared format rules now cover package files.

### Fixed

Docs, specs, and examples now use correct links and indexes. README sections and package details now follow the shared conventions.

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
