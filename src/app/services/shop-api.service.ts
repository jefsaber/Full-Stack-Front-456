import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  AuthTokenResponse,
  AuthRefreshResponse,
  ProductsListResponse,
  ProductRatingResponse,
} from './types';
import { User, OrderSummary, OrderDetail, UserPreferences } from '../state/user/user.actions';
import { OrdersStorageService } from './orders-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ShopApiService {
  private readonly baseUrl = '/api';

  constructor(
    private http: HttpClient,
    private ordersStorage: OrdersStorageService
  ) {}

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

  // User Profile API - Mock data
  getUserProfile(): Observable<User> {
    console.log(`[MOCK] GET /api/me/`);
    
    // Get actual orders from storage
    const orders = this.ordersStorage.getAllOrders();
    
    return of({
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      fullName: 'John Doe',
      defaultAddress: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        zipCode: '75001',
        country: 'France',
      },
      preferences: {
        newsletter: true,
        defaultMinRating: 3,
      },
      orders: orders,
    });
  }

  updateUserPreferences(preferences: Partial<UserPreferences>): Observable<UserPreferences> {
    console.log(`[MOCK] PATCH /api/me/`, preferences);
    // Save to localStorage
    const stored = localStorage.getItem('userPreferences');
    const current = stored ? JSON.parse(stored) : { newsletter: false, defaultMinRating: 0 };
    const updated = { ...current, ...preferences };
    localStorage.setItem('userPreferences', JSON.stringify(updated));
    return of(updated);
  }

  // User Orders API - Get actual orders from storage
  getUserOrders(): Observable<OrderSummary[]> {
    console.log(`[MOCK] GET /api/me/orders/`);
    return of(this.ordersStorage.getAllOrders());
  }

  getOrderDetail(orderId: string): Observable<OrderDetail> {
    console.log(`[MOCK] GET /api/orders/${orderId}/`);
    
    const order = this.ordersStorage.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    return of(order);
  }
}
