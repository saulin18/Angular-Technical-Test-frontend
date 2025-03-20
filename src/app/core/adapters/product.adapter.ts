import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, ProductStatus } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductAdapter {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getProducts(limit: number = 10, page: number = 1): Observable<Product[]> {
    const start = (page - 1) * limit;
    return this.http.get<any[]>(`${this.apiUrl}/photos?_start=${start}&_limit=${limit}`).pipe(
      map(photos => photos.map(photo => ({
        id: photo.id,
        title: photo.title,
        
        description: `Description for ${photo.title}`,
        category: 'photo',
        image: photo.thumbnailUrl,
        status: null
      })))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/photos/${id}`).pipe(
      map(photo => ({
        id: photo.id,
        title: photo.title,
        description: `Description for ${photo.title}`,
        category: 'photo',
        image: photo.thumbnailUrl,
        status: null as ProductStatus
      }))
    );
  }
} 