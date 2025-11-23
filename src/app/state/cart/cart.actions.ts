import { createAction, props } from '@ngrx/store';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  avgRating: number;
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
