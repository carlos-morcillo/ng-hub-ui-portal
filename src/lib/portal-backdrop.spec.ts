import { TestBed } from '@angular/core/testing';

import { HubPortalBackdrop } from './portal-backdrop';

describe('hub-portal-backdrop', () => {
	it('should render backdrop with required CSS classes', () => {
		const fixture = TestBed.createComponent(HubPortalBackdrop);

		fixture.detectChanges();
		expect(fixture.nativeElement).toHaveClass('portal-backdrop');
		expect(fixture.nativeElement).toHaveClass('show');
		expect(fixture.nativeElement).not.toHaveClass('fade');
	});

	it('should render correct CSS classes for animations', () => {
		const fixture = TestBed.createComponent(HubPortalBackdrop);
		fixture.componentInstance.animation = true;

		fixture.detectChanges();
		expect(fixture.nativeElement).toHaveClass('show');
		expect(fixture.nativeElement).toHaveClass('fade');
	});
});
