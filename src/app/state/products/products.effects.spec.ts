import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { ProductsEffects } from './products.effects';
import * as ProductsActions from './products.actions';
import { ProductsCacheService } from './products-cache.service';
import { NotificationService } from '../../services/notification.service';
import { Action } from '@ngrx/store';

describe('ProductsEffects', () => {
  let effects: ProductsEffects;
  let actions$: Observable<Action>;
  let mockCacheService: jasmine.SpyObj<ProductsCacheService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    mockCacheService = jasmine.createSpyObj('ProductsCacheService', ['buildKey', 'get', 'set', 'hasChanged']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);

    TestBed.configureTestingModule({
      providers: [
        ProductsEffects,
        provideMockActions(() => actions$),
        { provide: ProductsCacheService, useValue: mockCacheService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    });

    effects = TestBed.inject(ProductsEffects);
  });

  describe('loadProducts$', () => {
    it('should dispatch loadProductsSuccess on successful load (no cache)', (done) => {
      const filters = { page: 1, pageSize: 10 };
      const action = ProductsActions.loadProducts({ filters });

      mockCacheService.buildKey.and.returnValue('test-key');
      mockCacheService.get.and.returnValue(undefined); // No cache

      actions$ = of(action);

      effects.loadProducts$.subscribe((result) => {
        expect(result.type).toBe('[Products] Load Products Success');
        expect(mockCacheService.set).toHaveBeenCalled();
        done();
      });
    });

    it('should use cached data when available', (done) => {
      const filters = { page: 1, pageSize: 10 };
      const action = ProductsActions.loadProducts({ filters });
      const cachedData = {
        count: 1,
        next: null,
        previous: null,
        results: [{ id: 1, name: 'Cached Product', price: 10, avgRating: 4, created_at: '', description: '', stock: 10, lowStockThreshold: 5, reviews_count: 0, owner_id: 1, ratings: [] }],
      };

      mockCacheService.buildKey.and.returnValue('test-key');
      mockCacheService.get.and.returnValue({ filtersKey: 'test-key', data: cachedData, timestamp: Date.now() });

      actions$ = of(action);

      let emitCount = 0;
      effects.loadProducts$.subscribe((result) => {
        emitCount++;
        if (emitCount === 1) {
          expect(result.type).toBe('[Products] Load Products Success');
          done();
        }
      });
    });
  });

  describe('loadRating$', () => {
    it('should dispatch loadRatingSuccess for existing product', (done) => {
      // Product with id 1 exists in mock data
      const action = ProductsActions.loadRating({ productId: 1 });

      actions$ = of(action);

      effects.loadRating$.subscribe((result) => {
        expect(result.type).toBe('[Products] Load Rating Success');
        const successAction = result as ReturnType<typeof ProductsActions.loadRatingSuccess>;
        expect(successAction.data.product_id).toBe(1);
        done();
      });
    });

    it('should dispatch loadRatingFailure for non-existing product', (done) => {
      const action = ProductsActions.loadRating({ productId: 9999 }); // Non-existing

      actions$ = of(action);

      effects.loadRating$.subscribe((result) => {
        expect(result.type).toBe('[Products] Load Rating Failure');
        const failureAction = result as ReturnType<typeof ProductsActions.loadRatingFailure>;
        expect(failureAction.error).toBe('Product not found');
        done();
      });
    });
  });

  describe('loadProductsFailure$', () => {
    it('should call notification service on failure', (done) => {
      const action = ProductsActions.loadProductsFailure({ error: 'Network error' });

      actions$ = of(action);

      effects.loadProductsFailure$.subscribe(() => {
        expect(mockNotificationService.error).toHaveBeenCalledWith(
          'Erreur lors du chargement des produits : Network error'
        );
        done();
      });
    });
  });

  describe('loadRatingFailure$', () => {
    it('should call notification service on rating failure', (done) => {
      const action = ProductsActions.loadRatingFailure({ error: 'Product not found' });

      actions$ = of(action);

      effects.loadRatingFailure$.subscribe(() => {
        expect(mockNotificationService.error).toHaveBeenCalledWith(
          'Erreur lors du chargement de la note : Product not found'
        );
        done();
      });
    });
  });
});
