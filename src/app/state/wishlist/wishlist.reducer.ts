import { createReducer, on } from '@ngrx/store';
import * as WishlistActions from './wishlist.actions';

export interface WishlistState {
  ids: number[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  ids: [],
  loading: false,
  error: null,
};

export const wishlistReducer = createReducer(
  initialState,
  on(WishlistActions.loadWishlist, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WishlistActions.setWishlist, (state, { ids }) => ({
    ...state,
    ids,
    loading: false,
    error: null,
  })),
  on(WishlistActions.addToWishlist, (state, { productId }) => ({
    ...state,
    ids: state.ids.includes(productId) ? state.ids : [...state.ids, productId],
  })),
  on(WishlistActions.removeFromWishlist, (state, { productId }) => ({
    ...state,
    ids: state.ids.filter((id) => id !== productId),
  })),
  on(WishlistActions.clearWishlist, (state) => ({
    ...state,
    ids: [],
  }))
);
