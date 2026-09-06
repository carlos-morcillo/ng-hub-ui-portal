import { NgModule } from '@angular/core';
import { HubPortal } from './portal';

export { HubPortal } from './portal';
export {
	HubPortalConfig
	// Types must be re-exported with `export type` under isolatedModules
} from './portal-config';
export type { HubPortalOptions, HubPortalUpdatableOptions } from './portal-config';
export { HubPortalRef, HubActivePortal } from './portal-ref';
export { HubPortalStack } from './portal-stack';
export { PortalDismissReasons } from './portal-dismiss-reasons';

/**
 * Backward-compatibility module kept for NgModule-based applications.
 *
 * @deprecated Inject `HubPortal` directly. It is `providedIn: 'root'`, so this module adds
 * nothing an application does not already have; importing it only creates a redundant second
 * instance in that injector, delegating to the same root `HubPortalStack` and
 * `HubPortalConfig`. Scheduled for removal in **23.0.0**.
 */
@NgModule({ providers: [HubPortal] })
export class HubPortalModule {}
