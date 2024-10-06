import { ComponentRef } from '@angular/core';
import { Observable, of, Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HubPortalBackdrop } from './portal-backdrop';
import { HubPortalWindow } from './portal-window';
import { HubPortalOptions, HubPortalUpdatableOptions } from './portal-config';
import { ContentRef, isDefined, isPromise } from 'ng-hub-ui-utils';

/**
 * A reference to the currently opened (active) portal.
 *
 * Instances of this class can be injected into your component passed as portal content.
 * So you can `.update()`, `.close()` or `.dismiss()` the portal window from your component.
 */
export class HubActivePortal {
	/**
	 * Updates options of an opened portal.
	 *
	 * @since 14.2.0
	 */
	update(options: HubPortalUpdatableOptions): void {}
	/**
	 * Closes the portal with an optional `result` value.
	 *
	 * The `HubPortalRef.result` promise will be resolved with the provided value.
	 */
	close(result?: any): void {}

	/**
	 * Dismisses the portal with an optional `reason` value.
	 *
	 * The `HubPortalRef.result` promise will be rejected with the provided value.
	 */
	dismiss(reason?: any): void {}
}

const WINDOW_ATTRIBUTES: string[] = [
	'animation',
	'ariaLabelledBy',
	'ariaDescribedBy',
	'backdrop',
	'centered',
	'fullscreen',
	'keyboard',
	'scrollable',
	'size',
	'windowClass',
	'portalDialogClass'
];
const BACKDROP_ATTRIBUTES: string[] = ['animation', 'backdropClass'];

/**
 * A reference to the newly opened portal returned by the `HubPortal.open()` method.
 */
export class HubPortalRef {
	private _closed = new Subject<any>();
	private _dismissed = new Subject<any>();
	private _hidden = new Subject<void>();
	private _resolve!: (result?: any) => void;
	private _reject!: (reason?: any) => void;

	private _applyWindowOptions(
		windowInstance: HubPortalWindow,
		options: HubPortalOptions
	): void {
		WINDOW_ATTRIBUTES.forEach((optionName: string) => {
			if (isDefined(options[optionName])) {
				windowInstance[optionName] = options[optionName];
			}
		});
	}

	private _applyBackdropOptions(
		backdropInstance: HubPortalBackdrop,
		options: HubPortalOptions
	): void {
		BACKDROP_ATTRIBUTES.forEach((optionName: string) => {
			if (isDefined(options[optionName])) {
				backdropInstance[optionName] = options[optionName];
			}
		});
	}

	/**
	 * Updates options of an opened portal.
	 *
	 * @since 14.2.0
	 */
	update(options: HubPortalUpdatableOptions): void {
		this._applyWindowOptions(this._windowCmptRef.instance, options);
		if (this._backdropCmptRef && this._backdropCmptRef.instance) {
			this._applyBackdropOptions(this._backdropCmptRef.instance, options);
		}
	}

	/**
	 * The instance of a component used for the portal content.
	 *
	 * When a `TemplateRef` is used as the content or when the portal is closed, will return `undefined`.
	 */
	get componentInstance(): any {
		if (this._contentRef && this._contentRef.componentRef) {
			return this._contentRef.componentRef.instance;
		}
	}

	/**
	 * The promise that is resolved when the portal is closed and rejected when the portal is dismissed.
	 */
	result: Promise<any>;

	/**
	 * The observable that emits when the portal is closed via the `.close()` method.
	 *
	 * It will emit the result passed to the `.close()` method.
	 *
	 * @since 8.0.0
	 */
	get closed(): Observable<any> {
		return this._closed.asObservable().pipe(takeUntil(this._hidden));
	}

	/**
	 * The observable that emits when the portal is dismissed via the `.dismiss()` method.
	 *
	 * It will emit the reason passed to the `.dismissed()` method by the user, or one of the internal
	 * reasons like backdrop click or ESC key press.
	 *
	 * @since 8.0.0
	 */
	get dismissed(): Observable<any> {
		return this._dismissed.asObservable().pipe(takeUntil(this._hidden));
	}

	/**
	 * The observable that emits when both portal window and backdrop are closed and animations were finished.
	 * At this point portal and backdrop elements will be removed from the DOM tree.
	 *
	 * This observable will be completed after emitting.
	 *
	 * @since 8.0.0
	 */
	get hidden(): Observable<void> {
		return this._hidden.asObservable();
	}

	/**
	 * The observable that emits when portal is fully visible and animation was finished.
	 * Portal DOM element is always available synchronously after calling 'portal.open()' service.
	 *
	 * This observable will be completed after emitting.
	 * It will not emit, if portal is closed before open animation is finished.
	 *
	 * @since 8.0.0
	 */
	get shown(): Observable<void> {
		return this._windowCmptRef.instance.shown.asObservable();
	}

	constructor(
		private _windowCmptRef: ComponentRef<HubPortalWindow>,
		private _contentRef: ContentRef,
		private _backdropCmptRef?: ComponentRef<HubPortalBackdrop>,
		private _beforeDismiss?: () => boolean | Promise<boolean>
	) {
		_windowCmptRef.instance.dismissEvent.subscribe((reason: any) => {
			this.dismiss(reason);
		});

		this.result = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
		this.result.then(null, () => {});
	}

	/**
	 * Closes the portal with an optional `result` value.
	 *
	 * The `HubMobalRef.result` promise will be resolved with the provided value.
	 */
	close(result?: any): void {
		if (this._windowCmptRef) {
			this._closed.next(result);
			this._resolve(result);
			this._removePortalElements();
		}
	}

	private _dismiss(reason?: any) {
		this._dismissed.next(reason);
		this._reject(reason);
		this._removePortalElements();
	}

	/**
	 * Dismisses the portal with an optional `reason` value.
	 *
	 * The `HubPortalRef.result` promise will be rejected with the provided value.
	 */
	dismiss(reason?: any): void {
		if (this._windowCmptRef) {
			if (!this._beforeDismiss) {
				this._dismiss(reason);
			} else {
				const dismiss = this._beforeDismiss();
				if (isPromise(dismiss)) {
					dismiss.then(
						(result) => {
							if (result !== false) {
								this._dismiss(reason);
							}
						},
						() => {}
					);
				} else if (dismiss !== false) {
					this._dismiss(reason);
				}
			}
		}
	}

	private _removePortalElements() {
		const windowTransition$ = this._windowCmptRef.instance.hide();
		const backdropTransition$ = this._backdropCmptRef
			? this._backdropCmptRef.instance.hide()
			: of(undefined);

		// hiding window
		windowTransition$.subscribe(() => {
			const { nativeElement } = this._windowCmptRef.location;
			nativeElement.parentNode.removeChild(nativeElement);
			this._windowCmptRef.destroy();
			this._contentRef?.viewRef?.destroy();

			this._windowCmptRef = <any>null;
			this._contentRef = <any>null;
		});

		// hiding backdrop
		backdropTransition$.subscribe(() => {
			if (this._backdropCmptRef) {
				const { nativeElement } = this._backdropCmptRef.location;
				nativeElement.parentNode.removeChild(nativeElement);
				this._backdropCmptRef.destroy();
				this._backdropCmptRef = <any>null;
			}
		});

		// all done
		zip(windowTransition$, backdropTransition$).subscribe(() => {
			this._hidden.next();
			this._hidden.complete();
		});
	}
}
