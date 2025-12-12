import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistState } from './wishlist.reducer';
import {
  selectAllProducts,
} from '../products/products.selectors';

const selectWishlistFeature = createFeatureSelector<WishlistState>('wishlist');

export const selectWishlistState = createSelector(
  selectWishlistFeature,
  (state) => state
);

export const selectWishlistIds = createSelector(
  selectWishlistFeature,
  (state) => state.ids
);

export const selectWishlistCount = createSelector(
  selectWishlistIds,
  (ids) => ids.length
);

export const selectWishlistProducts = createSelector(
  selectWishlistIds,
  selectAllProducts,
  (ids, products) => products.filter((product) => ids.includes(product.id))
);

export const selectIsProductInWishlist = (productId: number) =>
  createSelector(selectWishlistIds, (ids) => ids.includes(productId));
