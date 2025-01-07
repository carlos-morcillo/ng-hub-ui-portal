import { DOCUMENT } from '@angular/common';
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
import {
	getFocusableBoundaryElements,
	hubRunTransition,
	reflow,
	TransitionOptions
} from 'ng-hub-ui-utils';
import { Observable, Subject, zip } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'hub-portal-window',
    imports: [],
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
				(scrollable ? ' portal-dialog-scrollable' : '') +
				(portalDialogClass ? ' ' + portalDialogClass : '')
			"
		  role="document"
		  >
		  <div
				[class]="
					'portal-content' +
					(portalContentClass ? ' ' + portalContentClass : '')
				"
		    >
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

	@ViewChild('dialog', { static: true })
	private _dialogEl: ElementRef<HTMLElement>;

	@Input() animation: boolean;
	@Input() ariaLabelledBy: string;
	@Input() ariaDescribedBy: string;
	@Input() scrollable: string;
	@Input() windowClass: string;
	@Input() portalDialogClass: string;
	@Input() portalContentClass: string;

	singleContent!: boolean;

	@Output('dismiss') dismissEvent = new EventEmitter();

	shown = new Subject<void>();
	hidden = new Subject<void>();

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

		this._setFocus();
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
}
