import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HubPortal } from './portal';
import { PortalDismissReasons } from './portal-dismiss-reasons';
import { HubPortalModule } from './portal.module';

@Component({ standalone: true, template: '<p>portal content</p>' })
class PortalContent {}

/**
 * Presses `Escape` the way a real key press reaches the window: from inside the dialog,
 * bubbling up to the window element that owns the handler, and cancelable so that a handler
 * on the way up can consume it.
 */
function pressEscape(target: Element): void {
	target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
}

/** The most recently attached portal window, which is the top of the stack. */
function topWindow(): Element {
	const windows = document.querySelectorAll('.portal');
	return windows[windows.length - 1];
}

/** Lets the dismissal microtasks and the exit transition run before asserting. */
function settle(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve));
}

describe('portal Escape dismissal', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [HubPortalModule, PortalContent] });
	});

	afterEach(async () => {
		TestBed.inject(HubPortal).dismissAll();
		await settle();
		document.querySelectorAll('.portal').forEach((el) => el.remove());
	});

	it('dismisses an open portal with the ESC reason when Escape is pressed', async () => {
		const portal = TestBed.inject(HubPortal);
		const ref = portal.open(PortalContent);
		let reason: unknown;
		ref.result.catch((rejection) => (reason = rejection));

		pressEscape(topWindow().querySelector('.portal-content')!);
		await settle();

		expect(reason).toBe(PortalDismissReasons.ESC);
		expect(portal.hasOpenPortals()).toBe(false);
	});

	it('keeps the portal open when the keyboard option is false', async () => {
		const portal = TestBed.inject(HubPortal);
		const ref = portal.open(PortalContent, { keyboard: false });
		let dismissed = false;
		ref.result.catch(() => (dismissed = true));

		pressEscape(topWindow().querySelector('.portal-content')!);
		await settle();

		expect(dismissed).toBe(false);
		expect(portal.hasOpenPortals()).toBe(true);
	});

	it('ignores an Escape another handler already consumed', async () => {
		const portal = TestBed.inject(HubPortal);
		const ref = portal.open(PortalContent);
		let dismissed = false;
		ref.result.catch(() => (dismissed = true));

		const content = topWindow().querySelector('.portal-content')!;
		content.addEventListener('keydown', (event) => event.preventDefault(), { once: true });
		pressEscape(content);
		await settle();

		expect(dismissed).toBe(false);
		expect(portal.hasOpenPortals()).toBe(true);
	});

	it('dismisses only the top-most window when portals are stacked', async () => {
		const portal = TestBed.inject(HubPortal);
		const first = portal.open(PortalContent);
		const second = portal.open(PortalContent);
		let firstDismissed = false;
		first.result.catch(() => (firstDismissed = true));
		let secondReason: unknown;
		second.result.catch((rejection) => (secondReason = rejection));

		pressEscape(topWindow().querySelector('.portal-content')!);
		await settle();

		expect(secondReason).toBe(PortalDismissReasons.ESC);
		expect(firstDismissed).toBe(false);
		expect(portal.hasOpenPortals()).toBe(true);
	});
});
