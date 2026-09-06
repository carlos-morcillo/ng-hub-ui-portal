import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HubPortal } from './portal';
import { HubPortalModule } from './portal.module';

@Component({ standalone: true, template: '<p>generic portal content</p>' })
class PortalContent {
	readonly label = 'content';
}

/** Lets the closing microtasks and the exit transition run before asserting. */
function settle(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve));
}

/**
 * The generics only ever show up at compile time, so every guard here is an assignment the
 * build has to reject. `@ts-expect-error` turns that around: the spec stops compiling the day
 * `componentInstance` or the result flow falls back to `any` and the assignment starts passing.
 */
describe('portal generics', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [HubPortalModule, PortalContent] });
	});

	afterEach(async () => {
		TestBed.inject(HubPortal).dismissAll();
		await settle();
		document.querySelectorAll('.portal').forEach((el) => el.remove());
	});

	it('infers the content component from the class handed to open()', () => {
		const ref = TestBed.inject(HubPortal).open(PortalContent);

		// @ts-expect-error the instance is a `PortalContent`, inferred from the class above.
		const notANumber: number = ref.componentInstance;

		expect(notANumber).toBeInstanceOf(PortalContent);
	});

	it('infers the content component from the class handed to toggle()', () => {
		const ref = TestBed.inject(HubPortal).toggle(PortalContent);

		// @ts-expect-error `toggle()` infers the same way `open()` does.
		const notANumber: number = ref.componentInstance;

		expect(notANumber).toBeInstanceOf(PortalContent);
	});

	it('types what close() accepts after the result type is declared', () => {
		const ref = TestBed.inject(HubPortal).open<PortalContent, string>(PortalContent);

		// @ts-expect-error the portal declares `string` as its result; a number is not one.
		const closeWithNumber: (result: number) => void = ref.close.bind(ref);

		expect(typeof closeWithNumber).toBe('function');
	});

	it('carries the declared result type through the promise and the closed stream', async () => {
		const ref = TestBed.inject(HubPortal).open<PortalContent, string>(PortalContent);
		const result: Promise<string> = ref.result;
		const seen: string[] = [];
		ref.closed.subscribe((value) => seen.push(value));

		ref.close('saved');
		await settle();

		await expect(result).resolves.toBe('saved');
		expect(seen).toEqual(['saved']);
	});
});
