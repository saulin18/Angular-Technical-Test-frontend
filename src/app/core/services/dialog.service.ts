import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../models/product.model';
import { ProductDetailsDialogComponent } from '../../features/product-details/product-details-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openProductDetails(product: Product): void {
    this.dialog.open(ProductDetailsDialogComponent, {
      width: '600px',
      data: product
    });
  }
} 