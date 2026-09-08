import { TestBed } from '@angular/core/testing';

import { HubPortal } from './portal';
import { PortalDismissReasons } from './portal-dismiss-reasons';
import { HubPortalModule } from './portal.module';

function pressEscape(target: Element): void {
	target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
}

function settle(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve));
}

/**
 * A string is the one kind of content that does not go through `splitIntoSlots`, so it is the
 * one kind that can disagree with the shape `_createWindowComponent` destructures. It did: the
 * text was returned as a single slot, so it landed in the HEADER and the body arrived
 * `undefined`, which Angular projects as nothing — the dialog opened empty.
 */
describe('string content', () => {
	beforeEach(() => TestBed.configureTestingModule({ imports: [HubPortalModule] }));

	afterEach(async () => {
		TestBed.inject(HubPortal).dismissAll();
		await settle();
		document.querySelectorAll('.portal').forEach((el) => el.remove());
	});

	const open = (content: string, options = {}) => TestBed.inject(HubPortal).open(content, { animation: false, ...options });

	it('renders the string inside the dialog', () => {
		open('Hello World (Simple text)').result.catch(() => {});

		expect(document.querySelector('.portal-content')?.textContent).toContain('Hello World (Simple text)');
	});

	it('leaves nothing in the header when the window draws its three slots', () => {
		open('Hello World (Simple text)', { headerSelector: '.no-match' }).result.catch(() => {});

		expect(document.querySelector('.portal-body')?.textContent).toContain('Hello World (Simple text)');
		expect(document.querySelector('.portal-header')?.textContent ?? '').not.toContain('Hello World');
	});

	it('opens without throwing', () => {
		expect(() => open('Hello World (Simple text)').result.catch(() => {})).not.toThrow();
	});

	/**
	 * The dialog a reader can see is also the one they must be able to leave. Pinned here
	 * because in `ng-hub-ui-modal` the same slot defect took the Escape handler down with it:
	 * appending the `undefined` body threw before the window armed its listeners.
	 */
	it('closes with Escape', async () => {
		const ref = open('Hello World (Simple text)');
		let reason: unknown;
		ref.result.catch((rejection) => (reason = rejection));

		pressEscape(document.querySelector('.portal-content')!);
		await settle();

		expect(reason).toBe(PortalDismissReasons.ESC);
		expect(TestBed.inject(HubPortal).hasOpenPortals()).toBe(false);
	});
});
