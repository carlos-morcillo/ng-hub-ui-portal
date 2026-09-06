import { InputSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { HubPortalOptions } from './portal-config';
import { HubPortalWindow } from './portal-window';

describe('hub-portal-dialog', () => {
	let fixture: ComponentFixture<HubPortalWindow>;

	beforeEach(() => {
		fixture = TestBed.createComponent(HubPortalWindow);
	});

	describe('basic rendering functionality', () => {
		it('should render default portal window', () => {
			fixture.detectChanges();

			const portalEl: Element = fixture.nativeElement;
			const dialogEl: Element = fixture.nativeElement.querySelector('.portal-dialog');

			expect(portalEl.classList.contains('portal')).toBe(true);
			expect(dialogEl.classList.contains('portal-dialog')).toBe(true);
		});

		it('should render default portal window with a specified class', () => {
			fixture.componentRef.setInput('windowClass', 'custom-class');
			fixture.detectChanges();

			expect(fixture.nativeElement.classList.contains('custom-class')).toBe(true);
		});

		it('aria attributes', () => {
			fixture.detectChanges();
			const dialogEl: Element = fixture.nativeElement.querySelector('.portal-dialog');

			expect(fixture.nativeElement.getAttribute('role')).toBe('dialog');
			expect(dialogEl.getAttribute('role')).toBe('document');
		});

		it('should render portal dialog with a specified class', () => {
			fixture.componentRef.setInput('portalDialogClass', 'custom-dialog-class');
			fixture.detectChanges();

			const dialogEl: Element = fixture.nativeElement.querySelector('.portal-dialog');
			expect(dialogEl.classList.contains('portal-dialog')).toBe(true);
			expect(dialogEl.classList.contains('custom-dialog-class')).toBe(true);
		});

		it('should type and apply `scrollable` exactly as `HubPortalOptions` declares it', () => {
			// `HubPortalRef` pushes the option into this input through the name-based
			// `setInput`, so the compiler never sees the two drift apart. This assignment
			// is the only place that can: it fails to build if the input stops carrying
			// the option's own type.
			const scrollable: InputSignal<HubPortalOptions['scrollable']> = fixture.componentInstance.scrollable;

			fixture.componentRef.setInput('scrollable', true);
			fixture.detectChanges();

			const dialogEl: Element = fixture.nativeElement.querySelector('.portal-dialog');
			expect(scrollable()).toBe(true);
			expect(dialogEl.classList.contains('portal-dialog-scrollable')).toBe(true);
		});

		it('should render portal content with a specified class', () => {
			fixture.componentRef.setInput('portalContentClass', 'custom-content-class');
			fixture.detectChanges();

			const contentEl: Element = fixture.nativeElement.querySelector('.portal-content');
			expect(contentEl.classList.contains('portal-content')).toBe(true);
			expect(contentEl.classList.contains('custom-content-class')).toBe(true);
		});
	});
});
