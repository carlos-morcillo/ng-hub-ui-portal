import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { HubPortal } from './portal';
import { HubPortalModule } from './portal.module';

@Component({ standalone: true, template: '<p>portal content</p>' })
class PortalContent {}

function settle(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve));
}

/**
 * While a portal is open the library marks `<body>`, so the host can lock the page behind it.
 * The mark used to be the unprefixed `portal-open`, a name in the application's namespace
 * rather than in the library's; `hub-portal-open` is the one to match from now on, and the old
 * one is written beside it until 23.0.0.
 */
describe('body open class', () => {
	beforeEach(() => TestBed.configureTestingModule({ imports: [HubPortalModule, PortalContent] }));

	afterEach(async () => {
		TestBed.inject(HubPortal).dismissAll();
		await settle();
		document.querySelectorAll('.portal').forEach((el) => el.remove());
		document.body.classList.remove('hub-portal-open', 'portal-open');
	});

	it('marks the body with the prefixed class while a portal is open', () => {
		TestBed.inject(HubPortal)
			.open(PortalContent, { animation: false })
			.result.catch(() => {});

		expect(document.body.classList.contains('hub-portal-open')).toBe(true);
	});

	it('still writes the deprecated unprefixed class beside it', () => {
		TestBed.inject(HubPortal)
			.open(PortalContent, { animation: false })
			.result.catch(() => {});

		expect(document.body.classList.contains('portal-open')).toBe(true);
	});

	it('removes both once the last portal is gone', async () => {
		const portal = TestBed.inject(HubPortal);
		portal.open(PortalContent, { animation: false }).result.catch(() => {});

		portal.dismissAll();
		await settle();

		expect(document.body.classList.contains('hub-portal-open')).toBe(false);
		expect(document.body.classList.contains('portal-open')).toBe(false);
	});
});
