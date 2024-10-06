// import {
// 	Component,
// 	inject,
// 	Injectable,
// 	NgModule,
// 	OnDestroy
// } from '@angular/core';
// import { HubPortal } from './portal';
// import { HubPortalModule } from './portal.module';
// import { RouterModule } from '@angular/router';

// @Injectable()
// class LazyService {
// 	get text() {
// 		return 'lazy portal';
// 	}
// }

// @Component({ template: '{{ lazyService.text }}' })
// class LazyPortalContent {
// 	constructor(public lazyService: LazyService) {}
// }

// @Component({ template: 'child' })
// class LazyComponent implements OnDestroy {
// 	private _ref = inject(HubPortal).open(LazyPortalContent);

// 	ngOnDestroy() {
// 		this._ref.close();
// 	}
// }

// @NgModule({
// 	declarations: [LazyComponent, LazyPortalContent],
// 	providers: [LazyService],
// 	imports: [
// 		HubPortalModule,
// 		RouterModule.forChild([
// 			{
// 				path: '',
// 				component: LazyComponent
// 			}
// 		])
// 	]
// })
// export default class LazyModule {}
