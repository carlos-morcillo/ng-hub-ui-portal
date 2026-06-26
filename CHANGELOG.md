# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.0.1] - 2026-06-26

### Fixed

- Corrected the Angular peer dependency range to `>=18.0.0`. The library uses APIs introduced in Angular 17 (signal `input()`/`output()`, the `@if` control flow and/or signal queries), whose real minimum is Angular 17.3, so the previous `>=16.0.0` range was too low and let it install on incompatible versions.
- Corrected the `ng-hub-ui-utils` peer dependency range to `>=1.0.0`. The previous caret range (`^1.x`) resolved to `>=1 <2`, which excluded the current `ng-hub-ui-utils` (22.x) and made the peer impossible to satisfy.

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.


## [0.3.4] - 2026-06-14

### Fixed

- Apply portal window options (`animation`, `windowClass`, `portalDialogClass`, …) through `ComponentRef.setInput` instead of overwriting the instance properties. Since `HubPortalWindow` now declares these as Angular signal inputs, the previous direct assignment replaced the read-only signal function, causing `TypeError: ctx.animation is not a function` during change detection on every `HubPortal.open()`.
- Guard `parentNode` when removing the window element during teardown to avoid a `Cannot read properties of null (reading 'removeChild')` error when the element is already detached.
