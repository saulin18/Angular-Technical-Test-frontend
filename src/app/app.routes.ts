import { Routes } from '@angular/router';
import { withComponentInputBinding } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pending',
    pathMatch: 'full'
  },
  {
    path: 'pending',
    loadComponent: () => import('./features/pending-products/pending-products.component')
      .then(m => m.PendingProductsComponent)
  },
  {
    path: 'reviewed',
    loadComponent: () => import('./features/reviewed-products/reviewed-products.component')
      .then(m => m.ReviewedProductsComponent)
  }
];

export const routeConfig = withComponentInputBinding(); 