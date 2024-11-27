import { ComponentFixture, TestBed } from '@angular/core/testing';

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
			const dialogEl: Element =
				fixture.nativeElement.querySelector('.portal-dialog');

			expect(portalEl).toHaveClass('portal');
			expect(dialogEl).toHaveClass('portal-dialog');
		});

		it('should render default portal window with a specified class', () => {
			fixture.componentInstance.windowClass = 'custom-class';
			fixture.detectChanges();

			expect(fixture.nativeElement).toHaveClass('custom-class');
		});

		it('aria attributes', () => {
			fixture.detectChanges();
			const dialogEl: Element =
				fixture.nativeElement.querySelector('.portal-dialog');

			expect(fixture.nativeElement.getAttribute('role')).toBe('dialog');
			expect(dialogEl.getAttribute('role')).toBe('document');
		});

		it('should render portal dialog with a specified class', () => {
			fixture.componentInstance.portalDialogClass = 'custom-dialog-class';
			fixture.detectChanges();

			const dialogEl: Element =
				fixture.nativeElement.querySelector('.portal-dialog');
			expect(dialogEl).toHaveClass('portal-dialog');
			expect(dialogEl).toHaveClass('custom-dialog-class');
		});

		it('should render portal content with a specified class', () => {
			fixture.componentInstance.portalContentClass =
				'custom-content-class';
			fixture.detectChanges();

			const contentEl: Element =
				fixture.nativeElement.querySelector('.portal-content');
			expect(contentEl).toHaveClass('portal-content');
			expect(contentEl).toHaveClass('custom-content-class');
		});
	});
});
