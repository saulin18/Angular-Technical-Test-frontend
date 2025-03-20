import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../models/product.model';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ProductActions from './product.actions';
import { ProductAdapter } from '../adapters/product.adapter';
import { ProductStorageService } from '../services/product-storage.service';

@Injectable()
export class ProductEffects {
  loadInitialProducts$ = createEffect(() => this.actions$.pipe(
    ofType(ProductActions.loadInitialProducts),
    mergeMap(() => this.productAdapter.getProducts(10, 1)
      .pipe(
        map(products => {
          this.productStorage.saveProducts(products);
          return ProductActions.loadProductsSuccess({ products });
        }),
        catchError(error => of(ProductActions.loadProductsFailure({ error: error.message })))
      ))
  ));

  loadMoreProducts$ = createEffect(() => this.actions$.pipe(
    ofType(ProductActions.loadMoreProducts),
    withLatestFrom(this.store.select(state => state.products.allProducts)),
    mergeMap(([action, existingProducts]) => 
      this.productAdapter.getProducts(10, action.page).pipe(
        map(newProducts => {
          const mergedProducts = [...existingProducts, ...newProducts];
          this.productStorage.saveProducts(mergedProducts);
          return ProductActions.loadProductsSuccess({ products: mergedProducts });
        }),
        catchError(error => of(ProductActions.loadProductsFailure({ error: error.message })))
      )
    )
  ));

  updateProductStatus$ = createEffect(() => this.actions$.pipe(
    ofType(ProductActions.updateProductStatus),
    map(action => {
      try {
        const updatedProduct = this.productStorage.updateProductStatus(
          action.productId,
          action.status
        );
        return ProductActions.updateProductStatusSuccess({ product: updatedProduct });
      } catch (error) {
        return ProductActions.updateProductStatusFailure({ 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    })
  ));

  deleteProduct$ = createEffect(() => this.actions$.pipe(
    ofType(ProductActions.deleteProduct),
    map(action => {
      try {
        this.productStorage.deleteProduct(action.productId);
        return ProductActions.deleteProductSuccess({ productId: action.productId });
      } catch (error) {
        return ProductActions.deleteProductFailure({ 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    })
  ));

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private productAdapter: ProductAdapter,
    private productStorage: ProductStorageService
  ) {}
} 