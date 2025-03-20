import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Product } from '../../core/models/product.model';
import * as ProductActions from '../../core/store/product.actions';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppState } from '../../core/models/product.model';
import { RouterLink } from '@angular/router';
import { ProductStorageService } from '../../core/services/product-storage.service';
import { selectProductsLoading } from '../../core/store/product.selectors';
import { ProductDetailsDialogComponent } from '../product-details/product-details-dialog.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-reviewed-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatToolbarModule,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './reviewed-products.component.html',
  styleUrls: ['./reviewed-products.component.scss']
})
export class ReviewedProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('lastElement', { static: false }) lastElement!: ElementRef;
  
  private productStorage = inject(ProductStorageService);
  private store = inject(Store<AppState>);
  private dialog = inject(MatDialog);

  readonly reviewedProducts = computed(() => {
    const allReviewed = this.productStorage.reviewedProducts();
    const currentPageIndex = this.currentPage();
    const start = 0;
    const end = (currentPageIndex) * 7;
    return allReviewed.slice(start, end);
  });
  readonly loading$ = this.store.select(selectProductsLoading);
  private currentPage = signal<number>(1);
  private observer: IntersectionObserver | null = null;
  private isFirstLoad = true;
  private isLoading = false;

  constructor() {
    effect(() => {
    
      const products = this.reviewedProducts();
      if (products.length > 0 && !this.isFirstLoad) {
        setTimeout(() => this.observeLastElement(), 100);
      }
    });
  }

  ngOnInit() {
   
    const storedProducts = this.productStorage.getProducts();
    if (storedProducts.length > 0) {
      this.store.dispatch(ProductActions.loadProductsSuccess({ products: storedProducts }));
    } else {
      this.store.dispatch(ProductActions.loadInitialProducts());
    }
    this.setupIntersectionObserver();
    
    
    this.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  ngAfterViewInit() {
    this.observeLastElement();
  }

  ngOnDestroy() {
    this.cleanupObserver();
  }

  private setupIntersectionObserver() {
    this.cleanupObserver();
    
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.isFirstLoad && !this.isLoading) {
          this.loadMore();
        }
        if (this.isFirstLoad) {
          this.isFirstLoad = false;
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );
  }

  private observeLastElement() {
    if (this.lastElement && this.observer) {
      this.observer.disconnect();
      this.observer.observe(this.lastElement.nativeElement);
    }
  }

  private cleanupObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private loadMore(): void {
    if (this.isLoading) return;
    
    const nextPage = this.currentPage() + 1;
    const allReviewed = this.productStorage.reviewedProducts();
    const hasMore = (nextPage * 7) <= allReviewed.length;
    
    if (hasMore) {
      this.isLoading = true;
      
      setTimeout(() => {
        this.currentPage.set(nextPage);
        this.isLoading = false;
      }, 1000);
    }
  }

  deleteProduct(productId: number): void {
    this.store.dispatch(ProductActions.deleteProduct({ productId }));
  }

  viewDetails(product: Product): void {
    const dialogRef = this.dialog.open(ProductDetailsDialogComponent, {
      data: product,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.deleteProduct(result.productId);
      }
    });
  }
}
