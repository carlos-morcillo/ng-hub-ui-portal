import { inject, Injectable, Injector } from '@angular/core';

import { HubPortalConfig, HubPortalOptions } from './portal-config';
import { HubPortalRef } from './portal-ref';
import { HubPortalStack } from './portal-stack';

/**
 * A service for opening portal windows.
 *
 * Creating a portal is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 */
@Injectable({ providedIn: 'root' })
export class HubPortal {
	private _injector = inject(Injector);
	private _portalStack = inject(HubPortalStack);
	private _config = inject(HubPortalConfig);

	/**
	 * Opens a new portal window with the specified content and supplied options.
	 *
	 * Content can be provided as a `TemplateRef` or a component type. If you pass a component type as content,
	 * then instances of those components can be injected with an instance of the `HubActivePortal` class. You can then
	 * use `HubActivePortal` methods to close / dismiss portals from "inside" of your component.
	 *
	 * Also see the [`HubPortalOptions`](#/components/portal/api#HubPortalOptions) for the list of supported options.
	 */
	open(content: any, options: HubPortalOptions = {}): HubPortalRef {
		const combinedOptions = {
			...this._config,
			animation: this._config.animation,
			...options
		};
		return this._portalStack.open(this._injector, content, combinedOptions);
	}

	/**
	 * The function `toggle` opens a portal with specified content and options while dismissing any existing portals.
	 *
	 * @param {any} content - The `content` parameter in the `toggle` function is the content that you want to display within the
	 * portal. This can be any type of content such as a component, template, or any other HTML element that you want to show in the
	 * portal.
	 * @param {HubPortalOptions} options - The `options` parameter in the `toggle` function is an object that allows you to customize
	 * the behavior of the portal.
	 *
	 * @returns The `toggle` function is returning a `HubPortalRef` object.
	 */
	toggle(content: any, options: HubPortalOptions = {}): HubPortalRef {
		const combinedOptions = {
			...this._config,
			animation: this._config.animation,
			...options
		};
		this.dismissAll();
		return this._portalStack.open(this._injector, content, combinedOptions);
	}

	/**
	 * Returns an observable that holds the active portal instances.
	 */
	get activeInstances() {
		return this._portalStack.activeInstances;
	}

	/**
	 * Dismisses all currently displayed portal windows with the supplied reason.
	 *
	 * @since 3.1.0
	 */
	dismissAll(reason?: any) {
		this._portalStack.dismissAll(reason);
	}

	/**
	 * Indicates if there are currently any open portal windows in the application.
	 *
	 * @since 3.3.0
	 */
	hasOpenPortals(): boolean {
		return this._portalStack.hasOpenPortals();
	}
}
