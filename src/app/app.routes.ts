import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
