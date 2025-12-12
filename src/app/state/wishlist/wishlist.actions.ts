import { createAction, props } from '@ngrx/store';

export const loadWishlist = createAction('[Wishlist] Load Wishlist');
export const setWishlist = createAction('[Wishlist] Set Wishlist', props<{ ids: number[] }>());
export const addToWishlist = createAction('[Wishlist] Add Item', props<{ productId: number }>());
export const removeFromWishlist = createAction('[Wishlist] Remove Item', props<{ productId: number }>());
export const clearWishlist = createAction('[Wishlist] Clear Wishlist');
