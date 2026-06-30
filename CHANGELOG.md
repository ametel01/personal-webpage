# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to semantic versioning where applicable.

## [Unreleased]

### Added
- Recorded baseline quality and viewport verification for the Hallmark audit remediation.
- Established progress and changelog tracking for the Hallmark audit remediation work.

### Changed
- Reworked the header into a quieter portfolio masthead with Resume as a regular nav route instead of a prominent CTA button.
- Reduced repeated homepage section eyebrows by making the section heading label optional.
- Added shared display typography, OKLCH paper/surface/ink, focus, shadow, duration, and easing tokens for the audited visual system.

### Fixed
- Added root horizontal overflow clipping to `html` and `body`.
- Scoped the homepage selected-project proof e2e assertion to avoid duplicate-text strict locator failures.
