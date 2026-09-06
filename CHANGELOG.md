# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.1.0] - 2026-09-06

### Changed

- **Dropped the `angular16` keyword from the manifest.** The peer range has required Angular 18 or
  newer since 22.0.1, so the keyword was advertising the package to exactly the searchers whose
  install it would refuse.

- **`HubPortalRef` is generic, so opening a portal no longer costs you the types.**
  `HubPortal.open<C, R>()` and `toggle<C, R>()` infer `C` from the class handed to them, which is
  what makes `componentInstance` the component instead of `any`; `R` types the value that travels
  through `close()`, `result` and `closed`. Until now the README's own answer to this was to patch
  the reference by hand — `HubPortalRef & { componentInstance: UserDetailsComponent }` — a cast that
  claims a type nobody checks, and it was the documented way to do it. Both parameters default to
  `any`, but the point of the change is that `open(SomeComponent)` now infers `C` from the class,
  so `componentInstance` narrows from `any` to `C | void` and a call site that reached straight
  through it stops compiling. See `BREAKING_CHANGES.md`. `content` is now typed
  `Type<C> | TemplateRef<any> | string`, which is what the stack already accepted. This mirrors the
  shape `ng-hub-ui-modal` settled on in 22.5.0. Dismiss reasons stay untyped on purpose: they carry
  either an internal `PortalDismissReasons` value or whatever the consumer passed.

- **The documentation now describes the library that exists.** The docs page, both READMEs and
  `FUNCTIONALITIES.md` promised a backdrop, positioning strategies, named outlets, fifteen
  `--portal-*` custom properties and a directive API, none of which this library has ever
  shipped, so a reader who followed them wrote code against features that are not there. The
  claims are gone, the `Positioning` category is renamed after the option it really exposes —
  the container the window is appended to — the token table now reads the generated one (empty,
  as the README already said), and the installation note quotes the peer ranges the manifest
  actually declares (`ng-hub-ui-utils >=22.0.0`, Angular `>=18.0.0`) instead of the pre-22.0.1
  ones. `PortalDismissReasons.BACKDROP_CLICK` is documented for what it is: a value declared for
  consumers who draw their own backdrop, because this library draws none.

- **`HubPortalWindow` now declares `ChangeDetectionStrategy.OnPush`.** Its template reads signal
  inputs only, and `HubPortalRef` updates them through `ComponentRef.setInput`, which marks the view
  itself — the window never needed a check it had not been marked for. Angular 22 already treats a
  component that names no strategy as OnPush, so nothing changes for an application on the current
  major; the declaration is what carries the strategy into the published package, compiled in partial
  mode for a peer range that still admits Angular 18, whose linker resolves an unstated strategy to
  `Eager`.

### Deprecated

- **`HubPortalModule`, marked for removal in 23.0.0.** The class carried no `@deprecated` tag, so
  an editor gave no hint and neither did the build: a consumer had no way of learning the module
  was on its way out before it stopped existing. It now says so. Its whole body is
  `providers: [HubPortal]`, and `HubPortal` is `providedIn: 'root'` — so importing the module never
  enabled the service, it added a redundant second instance in whichever injector declared the
  import, delegating to the same root `HubPortalStack` and `HubPortalConfig`. Inject `HubPortal`
  and drop the import; nothing else changes. See `BREAKING_CHANGES.md`.

### Removed

- Removed the unused `BACKDROP_ATTRIBUTES` constant, a commented-out import in `portal-config.ts`
  and two commented-out lines of an older `toggle()` implementation. None of it was reachable, and
  `backdropClass` — the option half of that constant named — is not part of `HubPortalOptions`, so
  leaving it in suggested a backdrop API the library does not have. No behaviour changes.

### Fixed

- **`Escape` now dismisses the portal, as the `keyboard` option has always promised.** The option was
  declared, defaulted to `true` in `HubPortalConfig` and documented in the README and on the docs
  site, but no key listener existed anywhere in the library: the close button was the only way out of
  a focus-trapped `role="dialog"`, which left keyboard and screen-reader users stuck and forced every
  consumer to wire their own listener inside the projected component. The window now rejects its
  `result` promise with `PortalDismissReasons.ESC` — the reason the library exported without ever
  emitting it — honours `keyboard: false` per portal, steps aside when another handler has already
  consumed the key, and reacts only in the window holding focus, so a stack dismisses one dialog at a
  time from the top.

- **`scrollable` was declared a `string` on the portal window while `HubPortalOptions` declares it a
  `boolean`.** Nothing misbehaved — the template only tests the input for truthiness, and the option
  reaches it through the name-based `setInput`, which no compiler ever checks — so the two had been
  free to disagree since the input was written. They now agree, which is what stops the next reader
  from believing the window and passing `'true'`.

## [22.0.5] - 2026-09-01

### Changed

- **The `homepage` in the manifest points at this library's own documentation page** rather than at
  the site root. It is the link a registry shows beside the package and the one a reader clicks from
  it, and landing on a front page they then have to search is a worse answer than landing on the
  reference for the package they were already looking at. Metadata only — no code, no types, no
  styles change, and nothing a consumer imports is affected.

## [22.0.4] - 2026-08-08

### Fixed

- Documentation links now point at the canonical localized URLs. The README linked to `https://hubui.dev/<path>` with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.

## [22.0.3] - 2026-07-28

### Fixed

- Removed the invalid `aria-portal` attribute from the portal window host — it is not a real ARIA attribute (a copy-paste rename of `aria-modal`) and added noise for assistive technology. The window keeps `role="dialog"`, `aria-labelledby` and `aria-describedby`.

## [22.0.2] - 2026-07-26

### Fixed

- Declared the real `ng-hub-ui-utils` peer range: `>=22.0.0`. The previous `>=1.0.0` floor allowed resolving a utils major from a different era than the one this library is built and tested against.

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
