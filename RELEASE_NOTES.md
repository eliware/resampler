# Release Notes

## 14.0.0 — 2026-10-21

### Added

- Added an optional `logger` API option with structured records from `@eliware/log`.
- Added TypeScript declarations and API guidance for the logger option and its records.
- Added end-user guides for PCM data, stream use, API options, logging, and troubleshooting.

### Changed

- Updated package metadata and dependencies for v14.0.0. Added `@eliware/log` as a runtime dependency.
- Reorganized PCM and resampler helpers with matching tests in focused folders.
- Processed large input in bounded output batches and paused between batches when the readable stream applied backpressure.
- Joined split PCM frames without copying each full input chunk.
- Updated README.md and AGENTS.md to keep only required repository and package guidance.
- Aligned CI and npm publication workflows with the current shared workflows.
- Updated the Knit deployment workflow to use the standard install and test commands.

### Fixed

- Added in-memory sample PCM data to the PCM conversion example. The example writes outputs to a documented directory.
- Included cutoff and filter window values in filter coefficient cache keys.
- Changed the benchmark to import the public package entry point and reject invalid frame, repeat, and chunk counts.
- Corrected API and troubleshooting guidance to describe actual filter output length and stream behavior.

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
- Replaced the Node.js workflow with separate validation and publish workflows.
- Updated the license copyright notice to Eliware, 2026.

### Fixed

- Corrected documentation links and added indexes for each content area.
- Corrected PCM output so negative full scale encodes as -32768.
- Formatted maintained files with the shared package rules.
