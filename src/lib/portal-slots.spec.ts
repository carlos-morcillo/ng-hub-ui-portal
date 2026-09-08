import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { HubPortal } from './portal';
import { HubPortalModule } from './portal.module';

@Component({
	standalone: true,
	template: `
		<div class="wizard__head"><h2>Wizard</h2></div>
		<p class="wizard__body">Step body</p>
		<div class="wizard__controls"><button type="button" class="wizard__next">Next</button></div>
	`
})
class WizardComponent {}

function settle(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve));
}

/**
 * Guards the order `splitIntoSlots` imposes: both declared slots come out of the container
 * before the body is captured, and the body is captured as a static array. The old inline
 * version read the body between the two extractions and got away with it only because what it
 * captured was a live `childNodes` list — correct by accident, and one snapshot away from
 * shipping the emptied footer marker inside the body.
 */
describe('content slots', () => {
	beforeEach(() => TestBed.configureTestingModule({ imports: [HubPortalModule, WizardComponent] }));

	afterEach(async () => {
		TestBed.inject(HubPortal).dismissAll();
		await settle();
		document.querySelectorAll('.portal').forEach((el) => el.remove());
	});

	const openWizard = () =>
		TestBed.inject(HubPortal).open(WizardComponent, {
			headerSelector: '.wizard__head',
			footerSelector: '.wizard__controls',
			animation: false
		});

	it('fills each slot with what its selector claimed', () => {
		openWizard().result.catch(() => {});

		expect(document.querySelector('.portal-header')?.textContent).toContain('Wizard');
		expect(document.querySelector('.portal-footer')?.querySelector('.wizard__next')).toBeTruthy();
	});

	it('leaves the unclaimed content in the body', () => {
		openWizard().result.catch(() => {});

		const body = document.querySelector('.portal-body')!;

		expect(body.querySelector('.wizard__body')).toBeTruthy();
	});

	/**
	 * The marker elements are removed, not relocated — their children travel alone. If the body
	 * were captured before the footer was extracted, the emptied `.wizard__controls` wrapper
	 * would arrive here as a leftover element.
	 */
	it('keeps both slot markers out of the body', () => {
		openWizard().result.catch(() => {});

		const body = document.querySelector('.portal-body')!;

		expect(body.querySelector('.wizard__controls')).toBeNull();
		expect(body.querySelector('.wizard__head')).toBeNull();
	});
});
