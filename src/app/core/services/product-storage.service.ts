import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductStatus } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductStorageService {
  private readonly STORAGE_KEY = 'products';
  private productsSignal = signal<Product[]>([]);
  private readonly ITEMS_PER_PAGE = 7;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const products = JSON.parse(stored);
        this.productsSignal.set(products);
      } catch (error) {
        console.error('Error loading products from storage:', error);
        this.productsSignal.set([]);
      }
    }
  }

  getProducts(): Product[] {
    return this.productsSignal();
  }

  readonly pendingProducts = computed(() => 
    this.productsSignal().filter(p => p.status === null)
  );

  readonly reviewedProducts = computed(() => 
    this.productsSignal().filter(p => p.status !== null)
  );

  getReviewedProductsPage(page: number): Product[] {
    const reviewed = this.reviewedProducts();
    const start = page * this.ITEMS_PER_PAGE;
    const end = start + this.ITEMS_PER_PAGE;
    return reviewed.slice(start, end);
  }

  hasMoreReviewedProducts(page: number): boolean {
    const reviewed = this.reviewedProducts();
    return (page + 1) * this.ITEMS_PER_PAGE < reviewed.length;
  }

  saveProducts(products: Product[]): void {
    try {
      this.productsSignal.set(products);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to storage:', error);
    }
  }

  updateProductStatus(productId: number, status: ProductStatus): Product {
    const products = [...this.productsSignal()];
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct = {
      ...products[productIndex],
      status
    };
    
    products[productIndex] = updatedProduct;
    this.saveProducts(products);
    
    return updatedProduct;
  }

  deleteProduct(productId: number): void {
    const products = this.productsSignal().filter(p => p.id !== productId);
    this.saveProducts(products);
  }
} 