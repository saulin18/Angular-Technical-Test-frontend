import { createReducer, on } from '@ngrx/store';
import { ProductState } from '../models/product.model';
import * as ProductActions from './product.actions';

export const initialState: ProductState = {
  allProducts: [],
  loading: false,
  error: null
};

export const productFeatureKey = 'products';

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadInitialProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadMoreProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    allProducts: products,
    loading: false,
    error: null
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ProductActions.updateProductStatusSuccess, (state, { product }) => ({
    ...state,
    allProducts: state.allProducts.map(p => 
      p.id === product.id ? product : p
    )
  })),
  on(ProductActions.updateProductStatusFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ProductActions.deleteProductSuccess, (state, { productId }) => ({
    ...state,
    allProducts: state.allProducts.filter(p => p.id !== productId)
  })),
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    error
  }))
); 