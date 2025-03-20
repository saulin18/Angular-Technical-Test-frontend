export type ProductStatus = 'approved' | 'rejected' | null;

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  status: ProductStatus;
}

export interface ProductState {
  allProducts: Product[];
  loading: boolean;
  error: string | null;
}

export interface AppState {
  products: ProductState;
} 