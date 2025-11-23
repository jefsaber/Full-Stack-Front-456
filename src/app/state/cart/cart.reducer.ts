import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { CartItem } from './cart.actions';

export interface CartState {
  items: CartItem[];
}

export const initialState: CartState = {
  items: [],
};

export const cartReducer = createReducer(
  initialState,
  on(CartActions.addItem, (state, { product, quantity }) => {
    const existingItem = state.items.find(item => item.id === product.id);

    if (existingItem) {
      // If item exists, increase quantity
      return {
        ...state,
        items: state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      };
    }

    // Add new item
    return {
      ...state,
      items: [...state.items, { ...product, quantity }],
    };
  }),

  on(CartActions.removeItem, (state, { productId }) => ({
    ...state,
    items: state.items.filter(item => item.id !== productId),
  })),

  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      return {
        ...state,
        items: state.items.filter(item => item.id !== productId),
      };
    }

    return {
      ...state,
      items: state.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ),
    };
  }),

  on(CartActions.clearCart, () => ({
    items: [],
  })),

  on(CartActions.loadCartFromStorage, (state, { items }) => ({
    ...state,
    items,
  }))
);
