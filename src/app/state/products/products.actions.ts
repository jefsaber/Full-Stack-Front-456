import { createAction, props } from '@ngrx/store';

export interface ProductsFilters {
  page?: number;
  pageSize?: number;
  minRating?: number;
  ordering?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  avgRating: number;
  description: string;
  stock: number;
  lowStockThreshold: number;
  reviews_count: number;
  owner_id: number;
  ratings: { user_id: number; value: number }[];
  imageUrl?: string;
}

export interface ProductsResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Product[];
}

export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ filters?: ProductsFilters }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ data: ProductsResponse }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

export const refreshProducts = createAction(
  '[Products] Refresh Products',
  props<{ filters?: ProductsFilters; cacheKey: string }>()
);

export const loadRating = createAction(
  '[Products] Load Rating',
  props<{ productId: number }>()
);

export const loadRatingSuccess = createAction(
  '[Products] Load Rating Success',
  props<{ data: { product_id: number; avg_rating: number; count: number } }>()
);

export const loadRatingFailure = createAction(
  '[Products] Load Rating Failure',
  props<{ error: string }>()
);
