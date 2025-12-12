import { createAction, props } from '@ngrx/store';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  avgRating: number;
}

export interface CartPromoResult {
  itemsTotal: number;
  discount: number;
  shipping: number;
  taxes: number;
  grandTotal: number;
  appliedPromos: string[];
}

export const addItem = createAction(
  '[Cart] Add Item',
  props<{ product: Omit<CartItem, 'quantity'>; quantity: number }>()
);

export const removeItem = createAction(
  '[Cart] Remove Item',
  props<{ productId: number }>()
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: number; quantity: number }>()
);

export const clearCart = createAction(
  '[Cart] Clear Cart'
);

export const loadCartFromStorage = createAction(
  '[Cart] Load Cart From Storage',
  props<{ items: CartItem[] }>()
);

export const syncCartToStorage = createAction(
  '[Cart] Sync Cart To Storage'
);

export const applyPromoCode = createAction(
  '[Cart] Apply Promo Code',
  props<{ code: string }>()
);

export const applyPromoSuccess = createAction(
  '[Cart] Apply Promo Success',
  props<{ result: CartPromoResult }>()
);

export const applyPromoFailure = createAction(
  '[Cart] Apply Promo Failure',
  props<{ error: string }>()
);

export const clearCartPromo = createAction('[Cart] Clear Promo');
