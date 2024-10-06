import { Injectable, Injector } from '@angular/core';
// import { HubConfig } from '../hub-config';

/**
 * Options available when opening new portal windows with `HubPortal.open()` method.
 */
export interface HubPortalOptions {
	/**
	 * If `true`, portal opening and closing will be animated.
	 *
	 * @since 8.0.0
	 */
	animation?: boolean;

	/**
	 * `aria-labelledby` attribute value to set on the portal window.
	 *
	 * @since 2.2.0
	 */
	ariaLabelledBy?: string;

	/**
	 * `aria-describedby` attribute value to set on the portal window.
	 *
	 * @since 6.1.0
	 */
	ariaDescribedBy?: string;

	/**
	 * If `true`, the backdrop element will be created for a given portal.
	 *
	 * Alternatively, specify `'static'` for a backdrop which doesn't close the portal on click.
	 *
	 * Default value is `true`.
	 */
	backdrop?: boolean | 'static';

	/**
	 * Callback right before the portal will be dismissed.
	 *
	 * If this function returns:
	 * * `false`
	 * * a promise resolved with `false`
	 * * a promise that is rejected
	 *
	 * then the portal won't be dismissed.
	 */
	beforeDismiss?: () => boolean | Promise<boolean>;

	/**
	 * If `true`, the portal will be centered vertically.
	 *
	 * Default value is `false`.
	 *
	 * @since 1.1.0
	 */
	centered?: boolean;

	/**
	 * A selector specifying the element all new portal windows should be appended to.
	 * Since v5.3.0 it is also possible to pass the reference to an `HTMLElement`.
	 *
	 * If not specified, will be `body`.
	 */
	container?: string | HTMLElement;

	/**
	 * If `true` portal will always be displayed in fullscreen mode.
	 *
	 * For values like `'md'` it means that portal will be displayed in fullscreen mode
	 * only if the viewport width is below `'md'`. For custom strings (ex. when passing `'mysize'`)
	 * it will add a `'portal-fullscreen-mysize-down'` class.
	 *
	 * If not specified will be `false`.
	 *
	 * @since 12.1.0
	 */
	fullscreen?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | boolean | string;

	/**
	 * The `Injector` to use for portal content.
	 */
	injector?: Injector;

	/**
	 * If `true`, the portal will be closed when `Escape` key is pressed
	 *
	 * Default value is `true`.
	 */
	keyboard?: boolean;

	/**
	 * Scrollable portal content (false by default).
	 *
	 * @since 5.0.0
	 */
	scrollable?: boolean;

	/**
	 * Size of a new portal window.
	 */
	size?: 'sm' | 'lg' | 'xl' | string;

	/**
	 * A custom class to append to the portal window.
	 */
	windowClass?: string;

	/**
	 * A custom class to append to the portal dialog.
	 *
	 * @since 9.1.0
	 */
	portalDialogClass?: string;

	/**
	 * A custom class to append to the portal backdrop.
	 *
	 * @since 1.1.0
	 */
	backdropClass?: string;

	/**
	 * Allows to specify a custom selector for the header element of the portal window. This can be useful if you want to target
	 * a specific element within the portal to act as the header, for example, to apply custom styling or functionality to it. By
	 * providing a CSS selector string, you can target the desired	header element within the portal content.
	 */
	headerSelector?: string;

	/**
	 * Allows to specify a custom selector for the footer element of the portal window. This can be useful if you want to target
	 * a specific element within the portal to act as the footer, for example, to apply custom styling or functionality to it. By
	 * providing a CSS selector string, you can target the desired footer element within the portal content.
	 */
	footerSelector?: string;

	/** Used to specify a custom selector for elements that can trigger the dismissal of the portal window. By providing a CSS selector
	 * string for `dismissSelector`, you can target specific elements within the portal content that, when interacted with (e.g., clicked),
	 * will close or dismiss the portal window.
	 */
	dismissSelector?: string;

	/**
	 * Used to specify a custom selector for elements that can trigger the closing of the portal window. By providing a CSS selector
	 * string for `closeSelector`, you can target specific elements within the portal content that, when interacted with (e.g., clicked),
	 * will close the portal window. This allows for customization of the elements that can act as close buttons for the portal.
	 */
	closeSelector?: string;

	/** Used to store any additional data that needs to be passed to the portal window when it is opened. This property allows you
	 * to provide custom data to the portal component, which can then be accessed and utilized within the portal content or logic.
	 * It provides flexibility for passing dynamic information to the portal window based on the specific use case or requirements.
	 */
	data?: any;
}

/**
 * Options that can be changed on an opened portal with `HubPortalRef.update()` and `HubActivePortal.update()` methods.
 *
 * @since 14.2.0
 */
export type HubPortalUpdatableOptions = Pick<
	HubPortalOptions,
	| 'ariaLabelledBy'
	| 'ariaDescribedBy'
	| 'centered'
	| 'fullscreen'
	| 'backdropClass'
	| 'size'
	| 'windowClass'
	| 'portalDialogClass'
>;

/**
 * A configuration service for the [`HubPortal`](#/components/portal/api#HubPortal) service.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all portals used in the application.
 *
 * @since 3.1.0
 */
@Injectable({ providedIn: 'root' })
export class HubPortalConfig implements Required<HubPortalOptions> {
	// private _hubConfig = inject(HubConfig);
	private _animation: boolean;

	ariaLabelledBy: string;
	ariaDescribedBy: string;
	backdrop: boolean | 'static' = true;
	beforeDismiss: () => boolean | Promise<boolean>;
	centered: boolean;
	container: string | HTMLElement;
	fullscreen: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | boolean | string = false;
	injector: Injector;
	keyboard = true;
	scrollable: boolean;
	size: 'sm' | 'lg' | 'xl' | string;
	windowClass: string;
	portalDialogClass: string;
	backdropClass: string;
	headerSelector: string;
	footerSelector: string;
	dismissSelector: string = '[data-dismiss="portal"]';
	closeSelector: string = '[data-close="portal"]';
	data: any;

	get animation(): boolean {
		return this._animation ?? true /* this._hubConfig.animation */;
	}
	set animation(animation: boolean) {
		this._animation = animation;
	}
}
