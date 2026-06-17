import { Component, inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HubPortal } from './portal';
import { HubPortalModule } from './portal.module';

/**
 * Service provided locally to emulate a lazily-loaded feature scope. It proves
 * that dependencies declared alongside a lazily-loaded portal feature are
 * resolvable from the components that compose that feature.
 */
@Injectable({ providedIn: 'root' })
class LazyService {
	get text(): string {
		return 'lazy portal';
	}
}

/**
 * Content component that would be rendered inside the portal. It resolves its
 * text from the lazily-scoped service, mirroring how lazily-loaded portal
 * content obtains its dependencies through Angular's injector.
 */
@Component({ standalone: true, template: '{{ lazyService.text }}' })
class LazyPortalContent {
	readonly lazyService = inject(LazyService);
}

describe('portal lazy module', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HubPortalModule, LazyPortalContent],
			providers: [LazyService]
		});
	});

	it('exposes the HubPortal service from the portal module', () => {
		const portal = TestBed.inject(HubPortal);
		expect(portal).toBeTruthy();
	});

	it('reports no open portals before any portal is opened', () => {
		const portal = TestBed.inject(HubPortal);
		expect(portal.hasOpenPortals()).toBe(false);
	});

	it('resolves lazily-scoped dependencies for portal content components', () => {
		const fixture = TestBed.createComponent(LazyPortalContent);
		fixture.detectChanges();

		expect(fixture.componentInstance.lazyService).toBeInstanceOf(LazyService);
		expect(fixture.nativeElement.textContent).toContain('lazy portal');
	});

	it('opens a portal and renders its window without throwing', () => {
		const portal = TestBed.inject(HubPortal);

		// `open()` applies the window options (including the default
		// `animation: true`) and runs change detection internally. The window's
		// host binding `[class.fade]="animation()"` requires the input to remain
		// a signal: a regression where options were assigned directly over the
		// signal made this throw `animation is not a function`.
		const ref = portal.open(LazyPortalContent);

		expect(portal.hasOpenPortals()).toBe(true);

		const windowEl = document.querySelector('.portal');
		expect(windowEl).not.toBeNull();
		expect(windowEl?.classList.contains('fade')).toBe(true);

		ref.close();
	});

	it('honours a custom windowClass option through setInput', () => {
		const portal = TestBed.inject(HubPortal);

		const ref = portal.open(LazyPortalContent, { windowClass: 'my-custom-window' });

		const windowEl = document.querySelector('.portal');
		expect(windowEl?.classList.contains('my-custom-window')).toBe(true);

		ref.close();
	});
});
