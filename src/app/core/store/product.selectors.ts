import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../models/product.model';

export const selectProductFeature = createFeatureSelector<ProductState>('products');

export const selectAllProducts = createSelector(
  selectProductFeature,
  (state: ProductState) => state.allProducts
);

export const selectReviewedProducts = createSelector(
  selectAllProducts,
  (products) => products.filter(product => product.status !== null)
);

export const selectPendingProducts = createSelector(
  selectAllProducts,
  (products) => products.filter(product => product.status === null)
);

export const selectLoading = createSelector(
  selectProductFeature,
  (state: ProductState) => state.loading
);

export const selectError = createSelector(
  selectProductFeature,
  (state: ProductState) => state.error
); 

export const selectProductsLoading = createSelector(
  selectProductFeature,
  (state: ProductState) => state.loading
);