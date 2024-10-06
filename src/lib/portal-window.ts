import { DOCUMENT, NgIf } from '@angular/common';
import {
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import { fromEvent, Observable, Subject, zip } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { PortalDismissReasons } from './portal-dismiss-reasons';
import {
	isString,
	reflow,
	getFocusableBoundaryElements,
	hubRunTransition,
	TransitionOptions
} from 'ng-hub-ui-utils';

@Component({
	selector: 'hub-portal-window',
	standalone: true,
	imports: [NgIf],
	host: {
		'[class]': '"portal d-block" + (windowClass ? " " + windowClass : "")',
		'[class.fade]': 'animation',
		role: 'dialog',
		tabindex: '-1',
		'[attr.aria-portal]': 'true',
		'[attr.aria-labelledby]': 'ariaLabelledBy',
		'[attr.aria-describedby]': 'ariaDescribedBy'
	},
	template: `
		<div
			#dialog
			[class]="
				'portal-dialog' +
				(size ? ' portal-' + size : '') +
				(centered ? ' portal-dialog-centered' : '') +
				fullscreenClass +
				(scrollable ? ' portal-dialog-scrollable' : '') +
				(portalDialogClass ? ' ' + portalDialogClass : '')
			"
			role="document"
		>
			<div class="portal-content">
				<ng-container *ngIf="singleContent; else multipleContent">
					<ng-content></ng-content>
				</ng-container>
				<ng-template #multipleContent>
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
				</ng-template>
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

	@ViewChild('dialog', { static: true })
	private _dialogEl: ElementRef<HTMLElement>;

	@Input() animation: boolean;
	@Input() ariaLabelledBy: string;
	@Input() ariaDescribedBy: string;
	@Input() backdrop: boolean | string = true;
	@Input() centered: string;
	@Input() fullscreen: string | boolean;
	@Input() keyboard = true;
	@Input() scrollable: string;
	@Input() size: string;
	@Input() windowClass: string;
	@Input() portalDialogClass: string;

	singleContent!: boolean;

	@Output('dismiss') dismissEvent = new EventEmitter();

	shown = new Subject<void>();
	hidden = new Subject<void>();

	get fullscreenClass(): string {
		return this.fullscreen === true
			? ' portal-fullscreen'
			: isString(this.fullscreen)
			? ` portal-fullscreen-${this.fullscreen}-down`
			: '';
	}

	dismiss(reason): void {
		this.dismissEvent.emit(reason);
	}

	ngOnInit() {
		this._elWithFocus = this._document.activeElement;
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
			animation: this.animation,
			runningTransition: 'stop'
		};

		const windowTransition$ = hubRunTransition(
			this._zone,
			nativeElement,
			() => nativeElement.classList.remove('show'),
			context
		);
		const dialogTransition$ = hubRunTransition(
			this._zone,
			this._dialogEl.nativeElement,
			() => {},
			context
		);

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
			animation: this.animation,
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
		const dialogTransition$ = hubRunTransition(
			this._zone,
			this._dialogEl.nativeElement,
			() => {},
			context
		);

		zip(windowTransition$, dialogTransition$).subscribe(() => {
			this.shown.next();
			this.shown.complete();
		});

		this._enableEventHandling();
		this._setFocus();
	}

	private _enableEventHandling() {
		const { nativeElement } = this._elRef;
		this._zone.runOutsideAngular(() => {
			fromEvent<KeyboardEvent>(nativeElement, 'keydown')
				.pipe(
					takeUntil(this._closed$),
					filter((e) => e.key === 'Escape')
				)
				.subscribe((event) => {
					if (this.keyboard) {
						requestAnimationFrame(() => {
							if (!event.defaultPrevented) {
								this._zone.run(() =>
									this.dismiss(PortalDismissReasons.ESC)
								);
							}
						});
					} else if (this.backdrop === 'static') {
						this._bumpBackdrop();
					}
				});

			// We're listening to 'mousedown' and 'mouseup' to prevent portal from closing when pressing the mouse
			// inside the portal dialog and releasing it outside
			let preventClose = false;
			fromEvent<MouseEvent>(this._dialogEl.nativeElement, 'mousedown')
				.pipe(
					takeUntil(this._closed$),
					tap(() => (preventClose = false)),
					switchMap(() =>
						fromEvent<MouseEvent>(nativeElement, 'mouseup').pipe(
							takeUntil(this._closed$),
							take(1)
						)
					),
					filter(({ target }) => nativeElement === target)
				)
				.subscribe(() => {
					preventClose = true;
				});

			// We're listening to 'click' to dismiss portal on portal window click, except when:
			// 1. clicking on portal dialog itself
			// 2. closing was prevented by mousedown/up handlers
			// 3. clicking on scrollbar when the viewport is too small and portal doesn't fit (click is not triggered at all)
			fromEvent<MouseEvent>(nativeElement, 'click')
				.pipe(takeUntil(this._closed$))
				.subscribe(({ target }) => {
					if (nativeElement === target) {
						if (this.backdrop === 'static') {
							this._bumpBackdrop();
						} else if (this.backdrop === true && !preventClose) {
							this._zone.run(() =>
								this.dismiss(
									PortalDismissReasons.BACKDROP_CLICK
								)
							);
						}
					}

					preventClose = false;
				});
		});
	}

	private _disableEventHandling() {
		this._closed$.next();
	}

	private _setFocus() {
		const { nativeElement } = this._elRef;
		if (!nativeElement.contains(document.activeElement)) {
			const autoFocusable = nativeElement.querySelector(
				`[hubAutofocus]`
			) as HTMLElement;
			const firstFocusable =
				getFocusableBoundaryElements(nativeElement)[0];

			const elementToFocus =
				autoFocusable || firstFocusable || nativeElement;
			elementToFocus.focus();
		}
	}

	private _restoreFocus() {
		const body = this._document.body;
		const elWithFocus = this._elWithFocus;

		let elementToFocus;
		if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
			elementToFocus = elWithFocus;
		} else {
			elementToFocus = body;
		}
		this._zone.runOutsideAngular(() => {
			setTimeout(() => elementToFocus.focus());
			this._elWithFocus = null;
		});
	}

	private _bumpBackdrop() {
		if (this.backdrop === 'static') {
			hubRunTransition(
				this._zone,
				this._elRef.nativeElement,
				({ classList }) => {
					classList.add('portal-static');
					return () => classList.remove('portal-static');
				},
				{ animation: this.animation, runningTransition: 'continue' }
			);
		}
	}
}
