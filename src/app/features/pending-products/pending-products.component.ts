import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ProductDetailsDialogComponent } from '../product-details/product-details-dialog.component';
import { Product } from '../../core/models/product.model';
import * as ProductActions from '../../core/store/product.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppState } from '../../core/models/product.model';
import { RouterLink } from '@angular/router';
import { ProductStorageService } from '../../core/services/product-storage.service';
import { selectProductsLoading } from '../../core/store/product.selectors';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-pending-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './pending-products.component.html',
  styleUrls: ['./pending-products.component.scss']
})
export class PendingProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('lastElement', { static: false }) lastElement!: ElementRef;
  
  private productStorage = inject(ProductStorageService);
  private store = inject(Store<AppState>);
  private dialog = inject(MatDialog);

  readonly pendingProducts = this.productStorage.pendingProducts;
  readonly loading$ = this.store.select(selectProductsLoading);
  private currentPage = signal<number>(1);
  private observer: IntersectionObserver | null = null;
  private isFirstLoad = true;
  private isLoading = false;

  constructor() {
    effect(() => {
      // Re-observe last element when products list changes
      const products = this.pendingProducts();
      if (products.length > 0 && !this.isFirstLoad) {
        setTimeout(() => this.observeLastElement(), 100);
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(ProductActions.loadInitialProducts());
    this.setupIntersectionObserver();
    
    // Monitor loading state
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
    this.currentPage.set(nextPage);
    this.store.dispatch(ProductActions.loadMoreProducts({ page: nextPage }));
  }

  onApprove(product: Product) {
    this.store.dispatch(ProductActions.updateProductStatus({ 
      productId: product.id, 
      status: 'approved' 
    }));
  }

  onReject(product: Product) {
    this.store.dispatch(ProductActions.updateProductStatus({ 
      productId: product.id, 
      status: 'rejected' 
    }));
  }

  showDetails(product: Product) {
    const dialogRef = this.dialog.open(ProductDetailsDialogComponent, {
      data: product,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'delete') {
        this.store.dispatch(ProductActions.deleteProduct({ 
          productId: result.productId 
        }));
      }
    });
  }
} 