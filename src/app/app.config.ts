import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes, routeConfig } from './app.routes';
import { productReducer } from './core/store/product.reducer';
import { ProductEffects } from './core/store/product.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, routeConfig, withHashLocation()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideStore({
      products: productReducer
    }),
    provideEffects([ProductEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    })
  ]
}; 