import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { selectCartItems } from './cart.selectors';

const CART_STORAGE_KEY = 'shop_cart_state';

@Injectable()
export class CartEffects {
  constructor(private actions$: Actions, private store: Store) {
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
}

