import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as CartActions from './cart.actions';
import { selectCartItems } from './cart.selectors';
import { applyPromoCode } from '../../../mocks/promo';
import { NotificationService } from '../../services/notification.service';

const CART_STORAGE_KEY = 'shop_cart_state';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly notification = inject(NotificationService);

  constructor() {
    this.initializePersistence();
  }

  private initializePersistence(): void {
    this.actions$
      .pipe(
        ofType(
          CartActions.addItem,
          CartActions.removeItem,
          CartActions.updateQuantity,
          CartActions.clearCart
        ),
        tap(() => {
          this.store.select(selectCartItems).subscribe((items) => {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
          });
        })
      )
      .subscribe();
  }

  applyPromo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.applyPromoCode),
      withLatestFrom(this.store.select(selectCartItems)),
      mergeMap(([{ code }, items]) => {
        try {
          const normalized = code?.trim().toUpperCase() || '';
          const result = applyPromoCode(items, normalized);
          return of(CartActions.applyPromoSuccess({ result }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to apply promo code';
          return of(CartActions.applyPromoFailure({ error: message }));
        }
      })
    )
  );

  applyPromoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.applyPromoSuccess),
        tap(({ result }) => {
          const discount = result.discount;
          if (discount > 0) {
            this.notification.success(`Code promo appliqué ! Remise de €${discount.toFixed(2)}`);
          }
        })
      ),
    { dispatch: false }
  );

  applyPromoFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.applyPromoFailure),
        tap(({ error }) => {
          this.notification.error(`Code promo invalide : ${error}`);
        })
      ),
    { dispatch: false }
  );
}

