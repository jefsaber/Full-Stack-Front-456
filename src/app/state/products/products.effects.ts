import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, EMPTY, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import * as ProductsActions from './products.actions';
import { ProductsCacheService } from './products-cache.service';
import { ProductsFilters, ProductsResponse } from './products.actions';
import { products } from '../../../mocks/data';
import { avgRating, paginate } from '../../../mocks/utils';

@Injectable()
export class ProductsEffects {
  private readonly actions$ = inject(Actions);
  private readonly cache = inject(ProductsCacheService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      mergeMap(({ filters }) => {
        const cacheKey = this.cache.buildKey(filters);
        const cached = this.cache.get(cacheKey);

        if (cached) {
          return concat(
            of(ProductsActions.loadProductsSuccess({ data: cached.data })),
            of(ProductsActions.refreshProducts({ filters, cacheKey }))
          ) as Observable<Action>;
        }

        const data = this.resolveProducts(filters);
        this.cache.set(cacheKey, data);

        return of(ProductsActions.loadProductsSuccess({ data }));
      })
    )
  );

  refreshProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.refreshProducts),
      mergeMap(({ filters, cacheKey }) => {
        const data = this.resolveProducts(filters);
        const hasChanged = this.cache.hasChanged(cacheKey, data);
        this.cache.set(cacheKey, data);

        if (!hasChanged) {
          return EMPTY as Observable<Action>;
        }

        return of(ProductsActions.loadProductsSuccess({ data }));
      })
    )
  );

  loadRating$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadRating),
      map(({ productId }) => {
        // Static mock product rating
        const product = products.find((p: any) => p.id === productId);

        if (!product) {
          return ProductsActions.loadRatingFailure({
            error: 'Product not found',
          });
        }

        return ProductsActions.loadRatingSuccess({
          data: {
            product_id: productId,
            avg_rating: avgRating(product.ratings),
            count: product.ratings.length,
          },
        });
      })
    )
  );

  private resolveProducts(filters?: ProductsFilters): ProductsResponse {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const minRating = filters?.minRating || 0;
    const ordering = filters?.ordering || '-created_at';

    let rows = products
      .map((p: any) => ({
        ...p,
        avgRating: avgRating(p.ratings),
        reviews_count: p.ratings.length,
        imageUrl: `https://picsum.photos/seed/${p.id}/520/520`,
      }))
      .filter((p: any) => p.avgRating >= minRating);

    const sign = ordering.startsWith('-') ? -1 : 1;
    const key = ordering.replace(/^-/, '');
    rows.sort((a: any, b: any) =>
      (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign
    );

    const { count, results } = paginate(rows, page, pageSize);

    return { count, next: null, previous: null, results };
  }
}
