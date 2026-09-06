# Breaking Changes — ng-hub-ui-portal

The major version tracks the Angular major this library targets, so it cannot carry a semver
warning. A breaking change therefore ships as a minor, and this file is the only notice you get.

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
