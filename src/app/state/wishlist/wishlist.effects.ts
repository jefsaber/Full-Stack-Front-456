import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as WishlistActions from './wishlist.actions';
import * as AuthActions from '../auth/auth.actions';
import { selectWishlistIds } from './wishlist.selectors';

const WISHLIST_STORAGE_KEY = 'shop_wishlist_state';

@Injectable()
export class WishlistEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  loadWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.loadWishlist),
      map(() => {
        try {
          const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
          const ids = saved ? (JSON.parse(saved) as number[]) : [];
          return WishlistActions.setWishlist({ ids });
        } catch (error) {
          return WishlistActions.setWishlist({ ids: [] });
        }
      })
    )
  );

  persistWishlist$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          WishlistActions.addToWishlist,
          WishlistActions.removeFromWishlist,
          WishlistActions.setWishlist,
          WishlistActions.clearWishlist
        ),
        withLatestFrom(this.store.select(selectWishlistIds)),
        tap(([, ids]) => {
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
        })
      ),
    { dispatch: false }
  );

  loadOnLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => WishlistActions.loadWishlist())
    )
  );

  clearOnLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => WishlistActions.clearWishlist())
    )
  );

  constructor() {}
}
