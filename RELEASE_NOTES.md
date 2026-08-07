# Release Notes

## 1.1.3 — August 7, 2026

- Aligned package metadata, published files, CI, documentation, examples, and validation with Eliware library conventions.
- Removed legacy `main` metadata and excluded tests from the published package.
- Standardized coverage-gap validation and expanded CI checks.
- Verification: 45 tests, 100% coverage, gap check, lint, typecheck, pack, benchmark, smoke test, and production audit pass.

## 1.1.2 — August 7, 2026

- Refactored the resampler into focused ESM modules for validation, filtering, channel mapping, and stream processing.
- Removed the internal `@eliware/common` runtime dependency.
- Added anti-alias filtering, bounded coefficient caching, resource limits, mono/stereo mapping, volume control, declarations, examples, benchmarks, and focused tests.
- Removed obsolete CommonJS entrypoints and excluded test files from the published package.
- Verification: 45 Jest tests, 100% coverage, gap check, Oxlint, typecheck, and package dry-run pass.

## 1.1.1 — December 9, 2025

- Initial published resampler release.
