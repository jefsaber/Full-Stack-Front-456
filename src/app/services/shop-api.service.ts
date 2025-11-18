import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AuthTokenResponse,
  AuthRefreshResponse,
  ProductsListResponse,
  ProductRatingResponse,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class ShopApiService {
  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthTokenResponse> {
    const url = `${this.baseUrl}/auth/token/`;
    const body = { username, password };
    console.log(`[API] POST ${url}`, body);
    return this.http.post<AuthTokenResponse>(url, body);
  }

  refreshToken(refreshToken: string): Observable<AuthRefreshResponse> {
    const url = `${this.baseUrl}/auth/token/refresh/`;
    const body = { refresh: refreshToken };
    console.log(`[API] POST ${url}`, body);
    return this.http.post<AuthRefreshResponse>(url, body);
  }

  getProducts(filters?: {
    page?: number;
    pageSize?: number;
    minRating?: number;
    ordering?: string;
  }): Observable<ProductsListResponse> {
    const url = `${this.baseUrl}/products/`;
    let params = new HttpParams();

    if (filters) {
      if (filters.page !== undefined) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.pageSize !== undefined) {
        params = params.set('page_size', filters.pageSize.toString());
      }
      if (filters.minRating !== undefined && filters.minRating > 0) {
        params = params.set('min_rating', filters.minRating.toString());
      }
      if (filters.ordering) {
        params = params.set('ordering', filters.ordering);
      }
    }

    console.log(`[API] GET ${url}`, params);
    return this.http.get<ProductsListResponse>(url, { params });
  }

  getProductRating(productId: number): Observable<ProductRatingResponse> {
    const url = `${this.baseUrl}/products/${productId}/rating/`;
    console.log(`[API] GET ${url}`);
    return this.http.get<ProductRatingResponse>(url);
  }
}
