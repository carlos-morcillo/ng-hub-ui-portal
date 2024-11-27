# ng-hub-ui-portal

A lightweight and flexible Angular portal library for dynamically rendering components and templates in any DOM container. Part of the ng-hub-ui suite of Angular components, this library provides a streamlined way to manage dynamic content rendering with full control over positioning and interaction.

## Overview

ng-hub-ui-portal allows you to create dynamic portal windows that can render components, templates, or simple text content. Unlike traditional modal dialogs, portals can be rendered in any DOM container, making them more versatile for complex UI requirements.

## Installation

```bash
npm install ng-hub-ui-portal
```

## Core Features

- Dynamic component and template rendering
- Custom container targeting
- Built-in animations
- Accessibility support with ARIA attributes
- Focus management
- Header and footer templating
- Customizable dismiss and close triggers

## Basic Usage

Start by importing the `HubPortal` service in your component:

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
    <div class="portal-body">
      Your content here
    </div>
    <div class="portal-footer">
      <button data-close="portal">Close</button>
    </div>
  `
})
export class PortalContentComponent {
  constructor(private activePortal: HubActivePortal) {}
  
  // Method to close the portal with a result
  close() {
    this.activePortal.close('Closed');
  }
  
  // Method to dismiss the portal with a reason
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
      <div class="portal-header">
        <h4>Template Portal</h4>
      </div>
      <div class="portal-body">
        Template content here
      </div>
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

Note: When opening a portal, consider specifying a container where it will be rendered. While it defaults to `body`, it's recommended to explicitly define your container for better control and organization.

## Container Management

The portal's `container` option determines where in the DOM the portal will be rendered. While it defaults to the document body, specifying a custom container gives you better control over portal placement and management.

### Specifying a Container

You can specify a container using either a CSS selector or a direct HTMLElement reference:

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

1. **Explicit Container Definition**: Although the body is available as a default, it's recommended to explicitly specify your container:
```typescript
// Recommended
const portalRef = this.portal.toggle(YourComponent, {
  container: '#specificContainer'
});

// Less ideal - relies on default body container
const portalRef = this.portal.toggle(YourComponent);
```

2. **Container Preparation**: Ensure your container exists in the DOM before opening the portal:
```html
<!-- In your template -->
<div id="portalContainer" class="portal-host">
  <!-- Portals will be rendered here -->
</div>
```

3. **Container Styling**: Consider styling your container appropriately:
```css
.portal-host {
  position: relative;
  min-height: 100px;
}
```

## Portal Opening Strategies

The library provides two distinct methods for opening portals, each with its own specific behavior:

### Open Method: Progressive Rendering

The `open()` method uses a progressive rendering strategy. When you call `open()`, the new portal is rendered while keeping any existing portals visible. This creates a layered effect where portals stack on top of each other, making it useful for scenarios where you want to display multiple related pieces of information simultaneously.

```typescript
// First portal opens
const portal1 = this.portal.open(Component1);
// Second portal opens on top of the first one
const portal2 = this.portal.open(Component2);
// Third portal opens on top of both previous portals
const portal3 = this.portal.open(Component3);
```

This approach is particularly useful when:
- You need to display a hierarchy of information
- Users need to reference information from previous portals
- You're implementing wizard-like interfaces where context needs to be preserved

### Toggle Method: Exclusive Rendering

The `toggle()` method implements an exclusive rendering strategy. When called, it first ensures all existing portals are properly closed before rendering the new one. This creates a cleaner, single-portal experience:

```typescript
// First portal opens
this.portal.toggle(Component1);
// First portal closes, then Component2 opens
this.portal.toggle(Component2);
// Second portal closes, then Component3 opens
this.portal.toggle(Component3);
```

This method is ideal when:
- You want to ensure only one portal is visible at a time
- You need to clean up previous portal states before showing new content
- You're implementing mutually exclusive views or workflows

### Choosing Between Open and Toggle

Consider these factors when deciding which method to use:
- Use `open()` when information from multiple portals needs to be visible simultaneously
- Use `toggle()` when you want to ensure a clean transition between different portal contents
- Consider UX implications: multiple stacked portals might be overwhelming in some cases
- Think about memory and performance: `toggle()` ensures cleanup of previous portals

## Working with Component Data

The portal library provides a straightforward way to pass data to rendered components through the `componentInstance` property of the portal reference. This allows you to directly interact with the component instance after it's been rendered.

### Passing Data to Portal Components

Here's how to work with component data:

```typescript
// Your portal component
@Component({
  template: `
    <div class="portal-header">
      <h4>User Details</h4>
    </div>
    <div class="portal-body">
      <p>Name: {{userName}}</p>
      <p>Role: {{userRole}}</p>
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

// In your parent component
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
    // First, open the portal and store the reference
    this.portalRef = this.portal.open(UserDetailsComponent);
    
    // Then, access the component instance and set its properties
    if (this.portalRef.componentInstance) {
      this.portalRef.componentInstance.userName = 'John Doe';
      this.portalRef.componentInstance.userRole = 'User';
    }
  }

  updateUserRole() {
    // You can call component methods through componentInstance
    if (this.portalRef.componentInstance) {
      this.portalRef.componentInstance.updateUser('Admin');
    }
  }
}
```

This approach gives you complete access to the component instance, allowing you to:
- Set properties directly
- Call component methods
- Access component state
- Trigger component functionality

The same pattern works with the `toggle` method:

```typescript
const portalRef = this.portal.toggle(UserDetailsComponent);
portalRef.componentInstance.userName = 'John Doe';
portalRef.componentInstance.userRole = 'User';
```

### Type Safety with Component Instance

For better TypeScript support, you can type your portal reference:

```typescript
// Store the portal reference with the correct component type
private portalRef: HubPortalRef & { componentInstance: UserDetailsComponent };

openUserPortal() {
  this.portalRef = this.portal.open(UserDetailsComponent);
  
  // Now TypeScript knows all the available properties and methods
  this.portalRef.componentInstance.userName = 'John Doe';
  this.portalRef.componentInstance.updateUser('Admin');
}
```


## Configuration Options

The portal can be configured with various options:

```typescript
this.portal.open(YourComponent, {
  animation: true,                     // Enable/disable animations
  container: 'body',                  // CSS selector or HTMLElement for portal container
  scrollable: true,                   // Enable scrollable content
  windowClass: 'custom-portal',       // Additional CSS class for portal window
  portalDialogClass: 'custom-dialog', // Additional CSS class for portal dialog
  portalContentClass: 'custom-content', // Additional CSS class for portal content
  headerSelector: '.portal-header',    // Custom header selector
  footerSelector: '.portal-footer',    // Custom footer selector
  dismissSelector: '[data-dismiss]',   // Custom dismiss trigger selector
  closeSelector: '[data-close]',       // Custom close trigger selector
  beforeDismiss: () => boolean,        // Callback before portal dismissal
  ariaLabelledBy: 'title-id',         // ARIA labelledby attribute
  ariaDescribedBy: 'desc-id',         // ARIA describedby attribute
});
```

## Portal Reference

The `open()` and `toggle()` methods return a `HubPortalRef` that you can use to control the portal:

```typescript
const portalRef = this.portal.open(YourComponent);

// Close the portal with a result
portalRef.close('result');

// Dismiss the portal with a reason
portalRef.dismiss('reason');

// Update portal options
portalRef.update({
  ariaLabelledBy: 'new-title-id',
  portalContentClass: 'updated-content'
});

// Subscribe to portal events
portalRef.closed.subscribe(result => console.log('Portal closed:', result));
portalRef.dismissed.subscribe(reason => console.log('Portal dismissed:', reason));
portalRef.hidden.subscribe(() => console.log('Portal hidden'));
portalRef.shown.subscribe(() => console.log('Portal shown'));
```

## Global Configuration

You can provide default options for all portals:

```typescript
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
export class AppModule { }
```

## Portal Stack Management

The library includes methods to manage multiple portals:

```typescript
// Check for open portals
if (this.portal.hasOpenPortals()) {
  // Handle open portals
}

// Toggle portal (closes existing portals before opening new one)
this.portal.toggle(NewComponent);

// Dismiss all open portals
this.portal.dismissAll('reason');

// Subscribe to active portal instances
this.portal.activeInstances.subscribe(portals => {
  console.log('Active portals:', portals.length);
});
```

## Accessibility

The library implements accessibility features:

- ARIA attributes support
- Keyboard navigation
- Focus management
- Screen reader compatibility


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

Run the test suite:
```bash
# Unit tests
npm run test

# E2E tests
npm run e2e

# Test coverage
npm run test:coverage
```

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactors
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```bash
git commit -m "feat: add custom divider support"
```

### Pull Request Process

1. Fork the repository
2. Create a new branch:
```bash
git checkout -b feat/my-new-feature
```
3. Make your changes
4. Add tests for any new functionality
5. Update documentation if needed
6. Submit a Pull Request

### Development Guidelines

- Write unit tests for new features
- Follow Angular style guide
- Update documentation for API changes
- Maintain backward compatibility
- Add comments for complex logic

### Issues

Before creating an issue, please:

- Check existing issues
- Use the issue template
- Include reproduction steps
- Specify your environment

### Code Style

We follow the [Angular Style Guide](https://angular.io/guide/styleguide):

- Use TypeScript
- Follow BEM for CSS
- Maintain consistent naming
- Add JSDoc comments

## Support the Project

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/carlosmorcillo)

Your support is greatly appreciated and helps maintain and improve this project!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Carlos Morcillo Fernández]
