import { createAction, props } from '@ngrx/store';
import { Product, ProductStatus } from '../models/product.model';


export const loadInitialProducts = createAction(
  '[Product] Load Initial Products'
);

export const loadMoreProducts = createAction(
  '[Product] Load More Products',
  props<{ page: number }>()
);

export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: string }>()
);


export const updateProductStatus = createAction(
  '[Product] Update Product Status',
  props<{ productId: number; status: ProductStatus }>()
);

export const updateProductStatusSuccess = createAction(
  '[Product] Update Product Status Success',
  props<{ product: Product }>()
);

export const updateProductStatusFailure = createAction(
  '[Product] Update Product Status Failure',
  props<{ error: string }>()
);


export const deleteProduct = createAction(
  '[Product] Delete Product',
  props<{ productId: number }>()
);

export const deleteProductSuccess = createAction(
  '[Product] Delete Product Success',
  props<{ productId: number }>()
);

export const deleteProductFailure = createAction(
  '[Product] Delete Product Failure',
  props<{ error: string }>()
); 