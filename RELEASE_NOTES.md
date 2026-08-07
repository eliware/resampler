# Release Notes

## 1.1.2 — August 7, 2026

### Changed

- Refactored the resampler into focused ESM modules for validation, filtering, channel mapping, and stream processing.
- Removed the internal `@eliware/common` dependency; the package is now standalone at runtime.
- Added anti-alias filtering and stable output-position tracking for streaming resampling.
- Added bounded sinc coefficient caching and repeatable streaming benchmarks.
- Added sample-rate and filter-window resource limits.
- Added mono/stereo channel mapping and volume behavior documentation.
- Added TypeScript declarations and declaration checking.
- Removed obsolete CommonJS entrypoints and tests.
- Added focused edge-case, DSP-quality, chunk-boundary, frame-count, and channel-mapping coverage.
- Added repository development guidance in `AGENTS.md`.

### Verification

- Jest: 33 tests passed.
- Coverage: 100% statements, branches, functions, and lines.
- Oxlint: 0 warnings/errors.
- TypeScript declaration check: passed.
- npm package dry run: passed.

## 1.1.1 — December 9, 2025

- Initial published resampler release.
