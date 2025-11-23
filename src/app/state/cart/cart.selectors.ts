import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';
import { CartItem } from './cart.actions';

export const selectCartFeature = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartFeature,
  (state: CartState) => state.items
);

export const selectCartCount = createSelector(
  selectCartItems,
  (items: CartItem[]) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartTotal = createSelector(
  selectCartItems,
  (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
);

export const selectCartSubtotal = createSelector(
  selectCartTotal,
  (total: number) => total
);

export const selectShippingCost = createSelector(
  selectCartTotal,
  (total: number) => {
    // Free shipping over €50
    return total >= 50 ? 0 : 5.99;
  }
);

export const selectTotalWithShipping = createSelector(
  selectCartSubtotal,
  selectShippingCost,
  (subtotal: number, shipping: number) => subtotal + shipping
);

export const selectCartEmpty = createSelector(
  selectCartItems,
  (items: CartItem[]) => items.length === 0
);

export const selectCartItem = (productId: number) =>
  createSelector(
    selectCartItems,
    (items: CartItem[]) => items.find(item => item.id === productId)
  );
