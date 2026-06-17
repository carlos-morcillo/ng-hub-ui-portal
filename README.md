# ng-hub-ui-portal

[Español](./README.es.md) | **English**

A lightweight and flexible Angular portal library for dynamically rendering components and templates in any DOM container. Part of the ng-hub-ui suite of Angular components, this library provides a streamlined way to manage dynamic content rendering with full control over positioning and interaction.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/portal/overview/
- Live examples: https://hubui.dev/portal/examples/
- Hub UI: https://hubui.dev/

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (deprecated — use ng-hub-ui-panels)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal) ← You are here
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [✨ Inspiration](#-inspiration)
- [📦 Overview](#-overview)
- [🎯 Core Features](#-core-features)
- [🚀 Installation](#-installation)
- [⚙️ Basic Usage](#️-basic-usage)
- [📂 Container Management](#-container-management)
- [🪟 Portal Opening Strategies](#-portal-opening-strategies)
- [🔗 Working with Component Data](#-working-with-component-data)
- [⚙️ Configuration Options](#️-configuration-options)
- [🪄 Portal Reference](#-portal-reference)
- [🌐 Global Configuration](#-global-configuration)
- [🧱 Portal Stack Management](#-portal-stack-management)
- [🪄 API Reference](#-api-reference)
- [🧩 Styling](#-styling)
- [♿ Accessibility](#-accessibility)
- [📊 Changelog](#-changelog)
- [🤝 Contribution](#-contribution)
- [☕ Support the Project](#-support-the-project)
- [📄 License](#-license)

---

## 🚀 Quick Start

Get up and running with ng-hub-ui-portal in less than 5 minutes.

### 1. Install

```bash
npm install ng-hub-ui-portal ng-hub-ui-utils
```

### 2. Inject the service

```typescript
import { Component } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';

@Component({
	selector: 'app-root',
	standalone: true,
	template: `<button (click)="open()">Open portal</button>`
})
export class AppComponent {
	constructor(private portal: HubPortal) {}

	open(): void {
		this.portal.open(MyContentComponent, { container: '#portalHost' });
	}
}
```

### 3. Close from inside the content

```typescript
import { Component } from '@angular/core';
import { HubActivePortal } from 'ng-hub-ui-portal';

@Component({
	template: `
		<div class="portal-body">Hello from a portal!</div>
		<button (click)="activePortal.close('done')">Close</button>
	`
})
export class MyContentComponent {
	constructor(public activePortal: HubActivePortal) {}
}
```

**💡 That's it!** You now have a dynamically rendered portal you can open, close, and dismiss programmatically.

---

## ✨ Inspiration

This library is inspired by the proven, battle-tested API design of `ng-bootstrap`'s modal service, reimagined as a generic, container-agnostic portal. Where a classic modal locks content into a centered dialog over a backdrop, `ng-hub-ui-portal` keeps the same ergonomic `open()` / `dismiss()` / `result` workflow while letting you render any component or template into **any** DOM container — enabling stacked panels, inline overlays, side drawers, and wizard-like flows without leaving the Angular dependency injection model.

## 📦 Overview

`ng-hub-ui-portal` allows you to create dynamic portal windows that can render components, templates, or simple text content. Unlike traditional modal dialogs, portals can be rendered in any DOM container, making them more versatile for complex UI requirements.

The library is **headless and structural** by design: it manages rendering, focus, the portal stack, and lifecycle promises/observables, while leaving the visual presentation entirely up to your content components and your own styles.

## 🎯 Core Features

- Dynamic component and template rendering
- Custom container targeting (CSS selector or `HTMLElement`)
- Built-in open/close animations
- Accessibility support with ARIA attributes
- Focus management
- Header and footer templating via custom selectors
- Customizable dismiss and close triggers
- Promise- and observable-based lifecycle (`result`, `closed`, `dismissed`, `shown`, `hidden`)
- Portal stack management for stacked or exclusive portals

## 🚀 Installation

```bash
npm install ng-hub-ui-portal ng-hub-ui-utils
```

> **Peer dependency:** `ng-hub-ui-portal` relies on [`ng-hub-ui-utils`](https://www.npmjs.com/package/ng-hub-ui-utils) (`^1.0.0`) for shared overlay/content helpers, alongside `@angular/common` and `@angular/core` (`>=16.0.0`). Make sure it is installed in your application.

## ⚙️ Basic Usage

Start by injecting the `HubPortal` service in your component:

```typescript
import { HubPortal } from 'ng-hub-ui-portal';

@Component({...})
export class YourComponent {
	constructor(private portal: HubPortal) {}

	openPortal() {
		this.portal.open(YourContentComponent);
	}
}
```

### Component-Based Portals

Create a component to be displayed in the portal:

```typescript
@Component({
	template: `
		<div class="portal-header">
			<h4>Portal Title</h4>
			<button type="button" data-dismiss="portal">Close</button>
		</div>
		<div class="portal-body">Your content here</div>
		<div class="portal-footer">
			<button data-close="portal">Close</button>
		</div>
	`
})
export class PortalContentComponent {
	constructor(private activePortal: HubActivePortal) {}

	// Close the portal with a result
	close() {
		this.activePortal.close('Closed');
	}

	// Dismiss the portal with a reason
	dismiss() {
		this.activePortal.dismiss('Dismissed');
	}
}
```

### Template-Based Portals

You can also use template references:

```typescript
@Component({
	template: `
		<ng-template #content>
			<div class="portal-header"><h4>Template Portal</h4></div>
			<div class="portal-body">Template content here</div>
		</ng-template>

		<button (click)="openPortal(content)">Open Portal</button>
	`
})
export class YourComponent {
	constructor(private portal: HubPortal) {}

	openPortal(content: TemplateRef<any>) {
		this.portal.open(content);
	}
}
```

> **Note:** When opening a portal, consider specifying a container where it will be rendered. While it defaults to `body`, it's recommended to explicitly define your container for better control and organization.

## 📂 Container Management

The portal's `container` option determines where in the DOM the portal will be rendered. While it defaults to the document body, specifying a custom container gives you better control over portal placement and management.

### Specifying a Container

You can specify a container using either a CSS selector or a direct `HTMLElement` reference:

```typescript
// Using a CSS selector
const portalRef = this.portal.open(YourComponent, {
	container: '#myContainer'
});

// Or using toggle
const portalRef = this.portal.toggle(YourComponent, {
	container: '#portalHost'
});

// Using an HTMLElement reference
const containerElement = document.querySelector('.portal-container');
const portalRef = this.portal.open(YourComponent, {
	container: containerElement
});
```

### Best Practices

1. **Explicit Container Definition** — Although the body is available as a default, it's recommended to explicitly specify your container:

```typescript
// Recommended
const portalRef = this.portal.toggle(YourComponent, {
	container: '#specificContainer'
});

// Less ideal - relies on default body container
const portalRef = this.portal.toggle(YourComponent);
```

2. **Container Preparation** — Ensure your container exists in the DOM before opening the portal:

```html
<div id="portalContainer" class="portal-host">
	<!-- Portals will be rendered here -->
</div>
```

3. **Container Styling** — Consider styling your container appropriately:

```css
.portal-host {
	position: relative;
	min-height: 100px;
}
```

## 🪟 Portal Opening Strategies

The library provides two distinct methods for opening portals, each with its own specific behavior.

### Open Method: Progressive Rendering

The `open()` method uses a progressive rendering strategy. When you call `open()`, the new portal is rendered while keeping any existing portals visible. This creates a layered effect where portals stack on top of each other.

```typescript
const portal1 = this.portal.open(Component1);
const portal2 = this.portal.open(Component2); // on top of the first
const portal3 = this.portal.open(Component3); // on top of both
```

This approach is particularly useful when:

- You need to display a hierarchy of information
- Users need to reference information from previous portals
- You're implementing wizard-like interfaces where context needs to be preserved

### Toggle Method: Exclusive Rendering

The `toggle()` method implements an exclusive rendering strategy. When called, it ensures previous portals are properly handled before rendering the new one, for a cleaner single-portal experience:

```typescript
this.portal.toggle(Component1);
this.portal.toggle(Component2);
this.portal.toggle(Component3);
```

This method is ideal when:

- You want to ensure only one portal is visible at a time
- You need to clean up previous portal states before showing new content
- You're implementing mutually exclusive views or workflows

### Choosing Between Open and Toggle

- Use `open()` when information from multiple portals needs to be visible simultaneously
- Use `toggle()` when you want to ensure a clean transition between different portal contents
- Consider UX implications: multiple stacked portals might be overwhelming in some cases
- Think about memory and performance: `toggle()` favors cleanup of previous portals

## 🔗 Working with Component Data

The portal library provides a straightforward way to pass data to rendered components through the `componentInstance` property of the portal reference.

### Passing Data to Portal Components

```typescript
@Component({
	template: `
		<div class="portal-header"><h4>User Details</h4></div>
		<div class="portal-body">
			<p>Name: {{ userName }}</p>
			<p>Role: {{ userRole }}</p>
		</div>
	`
})
export class UserDetailsComponent {
	userName: string;
	userRole: string;

	updateUser(role: string) {
		this.userRole = role;
	}
}

@Component({
	template: `
		<button (click)="openUserPortal()">Show User Details</button>
		<button (click)="updateUserRole()">Promote User</button>
	`
})
export class ParentComponent {
	private portalRef: HubPortalRef;

	constructor(private portal: HubPortal) {}

	openUserPortal() {
		this.portalRef = this.portal.open(UserDetailsComponent);

		if (this.portalRef.componentInstance) {
			this.portalRef.componentInstance.userName = 'John Doe';
			this.portalRef.componentInstance.userRole = 'User';
		}
	}

	updateUserRole() {
		if (this.portalRef.componentInstance) {
			this.portalRef.componentInstance.updateUser('Admin');
		}
	}
}
```

This approach gives you complete access to the component instance, allowing you to set properties directly, call component methods, access component state, and trigger component functionality.

The same pattern works with the `toggle` method:

```typescript
const portalRef = this.portal.toggle(UserDetailsComponent);
portalRef.componentInstance.userName = 'John Doe';
portalRef.componentInstance.userRole = 'User';
```

### Type Safety with Component Instance

For better TypeScript support, you can type your portal reference:

```typescript
private portalRef: HubPortalRef & { componentInstance: UserDetailsComponent };

openUserPortal() {
	this.portalRef = this.portal.open(UserDetailsComponent);

	// Now TypeScript knows all the available properties and methods
	this.portalRef.componentInstance.userName = 'John Doe';
	this.portalRef.componentInstance.updateUser('Admin');
}
```

## ⚙️ Configuration Options

The portal can be configured with various options (`HubPortalOptions`):

```typescript
this.portal.open(YourComponent, {
	animation: true, // Enable/disable animations
	container: 'body', // CSS selector or HTMLElement for portal container
	injector: customInjector, // Custom Injector for the portal content
	keyboard: true, // Close on Escape key press
	scrollable: true, // Enable scrollable content
	windowClass: 'custom-portal', // Additional CSS class for the portal window
	portalDialogClass: 'custom-dialog', // Additional CSS class for the portal dialog
	portalContentClass: 'custom-content', // Additional CSS class for the portal content
	headerSelector: '.portal-header', // Custom header selector
	footerSelector: '.portal-footer', // Custom footer selector
	dismissSelector: '[data-dismiss="portal"]', // Custom dismiss trigger selector
	closeSelector: '[data-close="portal"]', // Custom close trigger selector
	beforeDismiss: () => boolean, // Callback before portal dismissal
	ariaLabelledBy: 'title-id', // ARIA labelledby attribute
	ariaDescribedBy: 'desc-id' // ARIA describedby attribute
});
```

## 🪄 Portal Reference

The `open()` and `toggle()` methods return a `HubPortalRef` that you can use to control the portal:

```typescript
const portalRef = this.portal.open(YourComponent);

// Close the portal with a result (resolves portalRef.result)
portalRef.close('result');

// Dismiss the portal with a reason (rejects portalRef.result)
portalRef.dismiss('reason');

// Update portal options
portalRef.update({
	ariaLabelledBy: 'new-title-id',
	portalContentClass: 'updated-content'
});

// Awaiting the lifecycle promise
portalRef.result.then(
	(result) => console.log('Closed with:', result),
	(reason) => console.log('Dismissed with:', reason)
);

// Subscribe to portal events
portalRef.closed.subscribe((result) => console.log('Portal closed:', result));
portalRef.dismissed.subscribe((reason) => console.log('Portal dismissed:', reason));
portalRef.hidden.subscribe(() => console.log('Portal hidden'));
portalRef.shown.subscribe(() => console.log('Portal shown'));
```

## 🌐 Global Configuration

You can provide default options for all portals by configuring `HubPortalConfig`:

```typescript
import { HubPortalConfig } from 'ng-hub-ui-portal';

@NgModule({
	providers: [
		{
			provide: HubPortalConfig,
			useValue: {
				animation: true,
				keyboard: true,
				scrollable: false,
				dismissSelector: '[data-dismiss="portal"]',
				closeSelector: '[data-close="portal"]'
			}
		}
	]
})
export class AppModule {}
```

## 🧱 Portal Stack Management

The library includes methods to manage multiple portals:

```typescript
// Check for open portals
if (this.portal.hasOpenPortals()) {
	// Handle open portals
}

// Toggle portal (handles existing portals before opening a new one)
this.portal.toggle(NewComponent);

// Dismiss all open portals
this.portal.dismissAll('reason');

// Subscribe to active portal instances
this.portal.activeInstances.subscribe((portals) => {
	console.log('Active portals:', portals.length);
});
```

## 🪄 API Reference

### `HubPortal` (service, `providedIn: 'root'`)

| Member            | Signature                                              | Description                                                                    |
| ----------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `open`            | `(content: any, options?: HubPortalOptions) => HubPortalRef` | Opens a portal with the given content (component type or `TemplateRef`).        |
| `toggle`          | `(content: any, options?: HubPortalOptions) => HubPortalRef` | Opens a portal with exclusive-rendering behavior.                               |
| `activeInstances` | `Observable<HubPortalRef[]>`                           | Observable holding the currently active portal references.                      |
| `dismissAll`      | `(reason?: any) => void`                               | Dismisses all currently displayed portals with the supplied reason.             |
| `hasOpenPortals`  | `() => boolean`                                        | Indicates whether there are currently any open portals.                         |

### `HubActivePortal`

Injectable inside the content component to control its own portal.

| Member    | Signature                                       | Description                                            |
| --------- | ----------------------------------------------- | ------------------------------------------------------ |
| `update`  | `(options: HubPortalUpdatableOptions) => void`  | Updates options of the opened portal.                  |
| `close`   | `(result?: any) => void`                        | Closes the portal, resolving `HubPortalRef.result`.    |
| `dismiss` | `(reason?: any) => void`                        | Dismisses the portal, rejecting `HubPortalRef.result`. |

### `HubPortalRef`

Returned by `open()` / `toggle()`.

| Member              | Type                                            | Description                                                                |
| ------------------- | ----------------------------------------------- | -------------------------------------------------------------------------- |
| `result`            | `Promise<any>`                                  | Resolves when the portal is closed, rejects when it is dismissed.          |
| `componentInstance` | `any`                                           | The instance of the content component (`undefined` for templates/closed).  |
| `closed`            | `Observable<any>`                               | Emits when the portal is closed via `.close()`.                            |
| `dismissed`         | `Observable<any>`                               | Emits when the portal is dismissed via `.dismiss()`.                       |
| `shown`             | `Observable<void>`                              | Emits when the portal is fully visible and the open animation has ended.   |
| `hidden`            | `Observable<void>`                              | Emits when the portal is closed and the close animation has ended.         |
| `close`             | `(result?: any) => void`                        | Closes the portal with an optional result.                                 |
| `dismiss`           | `(reason?: any) => void`                        | Dismisses the portal with an optional reason.                              |
| `update`            | `(options: HubPortalUpdatableOptions) => void`  | Updates options of the opened portal.                                      |

### Interfaces & Types

- **`HubPortalOptions`** — options accepted by `open()` / `toggle()` (see [Configuration Options](#️-configuration-options)).
- **`HubPortalUpdatableOptions`** — subset of options that can be updated on an open portal: `ariaLabelledBy`, `ariaDescribedBy`, `windowClass`, `portalDialogClass`, `portalContentClass`.

### Other Exports

- **`HubPortalConfig`** — injectable service providing application-wide default options (see [Global Configuration](#-global-configuration)).
- **`HubPortalStack`** — low-level service that manages the portal stack (used internally by `HubPortal`).
- **`PortalDismissReasons`** — enum of built-in dismissal reasons: `BACKDROP_CLICK`, `ESC`.
- **`HubPortalModule`** — `NgModule` that registers the `HubPortal` provider (optional in standalone apps, since `HubPortal` is `providedIn: 'root'`).

## 🧩 Styling

`ng-hub-ui-portal` is a **headless / structural** library: it does not ship a themed design or expose CSS custom properties. The only built-in styles are minimal structural rules (e.g. a scrollable content host). You are in full control of the visual presentation through:

- The markup and styles of your **content components**.
- The `windowClass`, `portalDialogClass`, and `portalContentClass` options, which let you attach your own CSS classes to the generated portal elements.

```typescript
this.portal.open(MyContentComponent, {
	windowClass: 'app-portal',
	portalDialogClass: 'app-portal__dialog',
	portalContentClass: 'app-portal__content'
});
```

```css
.app-portal__dialog {
	max-width: 480px;
	margin: 2rem auto;
}

.app-portal__content {
	background: #fff;
	border-radius: 0.5rem;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
```

## ♿ Accessibility

The library implements accessibility features:

- ARIA attributes support (`ariaLabelledBy`, `ariaDescribedBy`)
- Keyboard navigation, including dismissal via the `Escape` key (`keyboard` option)
- Focus management
- Screen reader compatibility

## 📊 Changelog

All notable changes to this library are documented in [CHANGELOG.md](./CHANGELOG.md), following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The current version is **0.3.4**.

## 🤝 Contribution

We welcome all contributions! Here's how you can help.

### Development Setup

1. Clone the repository

```bash
git clone https://github.com/carlos-morcillo/ng-hub-ui-portal.git
cd ng-hub-ui-portal
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm start
```

### Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:coverage
```

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactors
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:

```bash
git commit -m "feat: add custom divider support"
```

### Pull Request Process

1. Fork the repository
2. Create a new branch: `git checkout -b feat/my-new-feature`
3. Make your changes
4. Add tests for any new functionality
5. Update documentation if needed
6. Submit a pull request

### Development Guidelines

- Write unit tests for new features
- Follow the Angular style guide
- Update documentation for API changes
- Maintain backward compatibility
- Add JSDoc comments for complex logic

### Reporting Issues

Before creating an issue, please:

- Check existing issues
- Include reproduction steps
- Specify your environment (Angular version, browser)

## ☕ Support the Project

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/carlosmorcillo)

Your support is greatly appreciated and helps maintain and improve this project!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Carlos Morcillo Fernández](https://www.carlosmorcillo.com)
