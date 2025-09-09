import { NgModule } from '@angular/core';
import { HubPortal } from './portal';

export { HubPortal } from './portal';
export {
	HubPortalConfig,
	// Types must be re-exported with `export type` under isolatedModules
} from './portal-config';
export type {
	HubPortalOptions,
	HubPortalUpdatableOptions
} from './portal-config';
export { HubPortalRef, HubActivePortal } from './portal-ref';
export { HubPortalStack } from './portal-stack';
export { PortalDismissReasons } from './portal-dismiss-reasons';

@NgModule({ providers: [HubPortal] })
export class HubPortalModule {}
