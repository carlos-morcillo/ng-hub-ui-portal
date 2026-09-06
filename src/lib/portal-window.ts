import { DOCUMENT } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	NgZone,
	OnDestroy,
	OnInit,
	ViewEncapsulation,
	input,
	output,
	viewChild
} from '@angular/core';
import { getFocusableBoundaryElements, hubRunTransition, reflow, TransitionOptions } from 'ng-hub-ui-utils';
import { fromEvent, Observable, Subject, zip } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { PortalDismissReasons } from './portal-dismiss-reasons';

@Component({
	selector: 'hub-portal-window',
	imports: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '"portal d-block" + (windowClass() ? " " + windowClass() : "")',
		'[class.fade]': 'animation()',
		role: 'dialog',
		tabindex: '-1',
		'[attr.aria-labelledby]': 'ariaLabelledBy()',
		'[attr.aria-describedby]': 'ariaDescribedBy()'
	},
	template: `
		<div
			#dialog
			[class]="
				'portal-dialog' +
				(scrollable() ? ' portal-dialog-scrollable' : '') +
				(portalDialogClass() ? ' ' + portalDialogClass() : '')
			"
			role="document"
		>
			<div [class]="'portal-content' + (portalContentClass() ? ' ' + portalContentClass() : '')">
				@if (singleContent) {
					<ng-content></ng-content>
				} @else {
					<div class="portal-header">
						<ng-content />
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="portal"
							aria-label="Close"
							(click)="dismiss(null)"
						></button>
					</div>
					<div class="portal-body">
						<ng-content />
					</div>
					<div class="portal-footer">
						<ng-content />
					</div>
				}
			</div>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	styleUrl: './portal.scss'
})
export class HubPortalWindow implements OnInit, OnDestroy {
	private _document = inject(DOCUMENT);
	private _elRef = inject(ElementRef<HTMLElement>);
	private _zone = inject(NgZone);

	private _closed$ = new Subject<void>();
	private _elWithFocus: Element | null = null; // element that is focused prior to portal opening

	private readonly _dialogEl = viewChild.required<ElementRef<HTMLElement>>('dialog');

	readonly animation = input<boolean>(true);
	readonly ariaLabelledBy = input<string>();
	readonly ariaDescribedBy = input<string>();
	readonly keyboard = input<boolean>(true);
	readonly scrollable = input<boolean>();
	readonly windowClass = input<string>();
	readonly portalDialogClass = input<string>();
	readonly portalContentClass = input<string>();

	singleContent!: boolean;

	readonly dismissEvent = output({ alias: 'dismiss' });

	shown = new Subject<void>();
	hidden = new Subject<void>();

	dismiss(reason: any): void {
		this.dismissEvent.emit(reason);
	}

	ngOnInit() {
		this._elWithFocus = this._document.activeElement;
		this._enableEventHandling();
		this._zone.onStable
			.asObservable()
			.pipe(take(1))
			.subscribe(() => {
				this._show();
			});
	}

	ngOnDestroy() {
		this._disableEventHandling();
	}

	hide(): Observable<any> {
		const { nativeElement } = this._elRef;
		const context: TransitionOptions<any> = {
			animation: this.animation(),
			runningTransition: 'stop'
		};

		const windowTransition$ = hubRunTransition(
			this._zone,
			nativeElement,
			() => nativeElement.classList.remove('show'),
			context
		);
		const dialogTransition$ = hubRunTransition(this._zone, this._dialogEl().nativeElement, () => {}, context);

		const transitions$ = zip(windowTransition$, dialogTransition$);
		transitions$.subscribe(() => {
			this.hidden.next();
			this.hidden.complete();
		});

		this._disableEventHandling();
		this._restoreFocus();

		return transitions$;
	}

	private _show() {
		const context: TransitionOptions<any> = {
			animation: this.animation(),
			runningTransition: 'continue'
		};

		const windowTransition$ = hubRunTransition(
			this._zone,
			this._elRef.nativeElement,
			(element: HTMLElement, animation: boolean) => {
				if (animation) {
					reflow(element);
				}
				element.classList.add('show');
			},
			context
		);
		const dialogTransition$ = hubRunTransition(this._zone, this._dialogEl().nativeElement, () => {}, context);

		zip(windowTransition$, dialogTransition$).subscribe(() => {
			this.shown.next();
			this.shown.complete();
		});

		this._setFocus();
	}

	/**
	 * Arms the `Escape` dismissal the `keyboard` option promises.
	 *
	 * It is armed from `ngOnInit` rather than from `_show()` so that a dialog whose entry
	 * transition never runs is still dismissable: a focus-trapped `role="dialog"` with no way
	 * out is the worse of the two failures. The listener sits on this window's own element, so
	 * in a stack only the window holding focus — the top-most one, which is where the focus trap
	 * keeps it — reacts to the key.
	 */
	private _enableEventHandling() {
		const { nativeElement } = this._elRef;
		this._zone.runOutsideAngular(() => {
			fromEvent<KeyboardEvent>(nativeElement, 'keydown')
				.pipe(
					takeUntil(this._closed$),
					filter((event) => event.key === 'Escape' && !event.defaultPrevented && this.keyboard())
				)
				.subscribe(() => this._zone.run(() => this.dismiss(PortalDismissReasons.ESC)));
		});
	}

	private _disableEventHandling() {
		this._closed$.next();
	}

	private _setFocus() {
		const { nativeElement } = this._elRef;
		if (!nativeElement.contains(document.activeElement)) {
			const autoFocusable = nativeElement.querySelector(`[hubAutofocus]`) as HTMLElement;
			const firstFocusable = getFocusableBoundaryElements(nativeElement)[0];

			const elementToFocus = autoFocusable || firstFocusable || nativeElement;
			elementToFocus.focus();
		}
	}

	private _restoreFocus() {
		const body = this._document.body;
		const elWithFocus = this._elWithFocus;

		let elementToFocus: HTMLElement;
		if (elWithFocus instanceof HTMLElement && body.contains(elWithFocus)) {
			elementToFocus = elWithFocus;
		} else {
			elementToFocus = body as unknown as HTMLElement;
		}
		this._zone.runOutsideAngular(() => {
			setTimeout(() => elementToFocus.focus());
			this._elWithFocus = null;
		});
	}
}
