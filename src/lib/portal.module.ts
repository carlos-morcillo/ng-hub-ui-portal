import { NgModule } from '@angular/core';
import { HubPortal } from './portal';

export { HubPortal } from './portal';
export {
	HubPortalConfig,
	HubPortalOptions,
	HubPortalUpdatableOptions
} from './portal-config';
export { HubPortalRef, HubActivePortal } from './portal-ref';
export { HubPortalStack } from './portal-stack';
export { PortalDismissReasons } from './portal-dismiss-reasons';

@NgModule({ providers: [HubPortal] })
export class HubPortalModule {}
