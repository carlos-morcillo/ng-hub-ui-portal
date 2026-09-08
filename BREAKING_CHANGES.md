# Breaking Changes — ng-hub-ui-portal

The major version tracks the Angular major this library targets, so it cannot carry a semver
warning. A breaking change therefore ships as a minor, and this file is the only notice you get.

## [22.2.0] - 2026-09-08

### Announced: the `portal-open` body class is removed in 23.0.0

- **Change**: while at least one portal is open the library marks `<body>`. The mark is now
  `hub-portal-open`; the unprefixed `portal-open` is written beside it and disappears in 23.0.0.
  Nothing is removed here — this release is the notice.
- **Impact**: an unprefixed class is a name in the application's namespace, not in the library's,
  so a host with its own `.portal-open` rule was silently joined by ours and had no way of
  finding out. From 23.0.0 a stylesheet still matching `portal-open` stops reacting, and, as with
  any CSS selector that no longer matches, nothing warns you: the page simply keeps scrolling
  behind the dialog, or whatever else that rule was for.
- **Migration**: rename the selector.

  ```css
  /* Before */
  body.portal-open {
  	overflow: hidden;
  }

  /* After */
  body.hub-portal-open {
  	overflow: hidden;
  }
  ```

### `scrollable` now does something

- **Change**: `scrollable: true` used to write `component-host-scrollable` on the content
  component's host element, which never enters the document, so the option had no effect
  whatsoever. It is now delivered by the dialog, through the `portal-dialog-scrollable` class the
  window already set, and the library's stylesheet dresses that class.
- **Impact**: a caller who passes `scrollable: true` today sees no change in layout, because
  nothing happened before. From this release the content box is pinned and the body scrolls inside
  it — which is what the option always said it did. If your own stylesheet already implemented
  `portal-dialog-scrollable` by hand, check it against ours before upgrading: yours still wins on
  equal specificity, being loaded later, but the two now overlap.
- **Migration**: none, unless you were relying on `scrollable` being inert.

## [22.1.0] - 2026-09-06
### `componentInstance` is typed, so reaching straight through it no longer compiles

- **Change**: `HubPortalRef` takes type parameters and `open()` / `toggle()` infer the first one
  from the class handed to them. `componentInstance` narrows from `any` to `C | void`, because a
  portal opened with a template or a plain string has no component instance to give back.
- **Impact**: any call site that read a member straight off the reference now fails to compile
  with `TS2339`. The compiler is right: the value really can be absent, and until now nothing
  said so.

  ```ts
  const ref = this.portal.open(UserDetailsComponent);
  ref.componentInstance.userName = 'John Doe'; // TS2339 from this release on
  ```

- **Migration**: assert it, or narrow it. Both were already the shape the README taught for the
  guarded case.

  ```ts
  ref.componentInstance!.userName = 'John Doe';

  if (ref.componentInstance) {
  	ref.componentInstance.userName = 'John Doe';
  }
  ```

  The hand-written patch the README used to recommend — `HubPortalRef & { componentInstance: X }` —
  can go: it claimed a type nobody checked, and inference now gives the real one.

### Announced: `HubPortalModule` is removed in 23.0.0

- **Change**: the class is now marked `@deprecated`. Nothing is removed here and nothing changes at
  runtime — this release is the notice, and the removal lands in 23.0.0, the next version that tracks
  a new Angular major.
- **Impact**: from 23.0.0 the symbol is gone from the entry point, so `import { HubPortalModule }`
  and `imports: [HubPortalModule]` stop compiling.
- **Migration**: delete the import and inject `HubPortal`. The module's whole body is
  `providers: [HubPortal]`, and the service is `providedIn: 'root'`, so it is already reachable from
  anywhere; the module only added a second instance in whichever injector declared the import,
  delegating to the same root `HubPortalStack` and `HubPortalConfig`.

  ```ts
  // Before
  @NgModule({ imports: [HubPortalModule] })
  export class AppModule {}

  // After — no import at all
  export class OrdersComponent {
  	readonly #portal = inject(HubPortal);
  }
  ```
