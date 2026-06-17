# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.


## [0.3.4] - 2026-06-14

### Fixed

- Apply portal window options (`animation`, `windowClass`, `portalDialogClass`, …) through `ComponentRef.setInput` instead of overwriting the instance properties. Since `HubPortalWindow` now declares these as Angular signal inputs, the previous direct assignment replaced the read-only signal function, causing `TypeError: ctx.animation is not a function` during change detection on every `HubPortal.open()`.
- Guard `parentNode` when removing the window element during teardown to avoid a `Cannot read properties of null (reading 'removeChild')` error when the element is already detached.
