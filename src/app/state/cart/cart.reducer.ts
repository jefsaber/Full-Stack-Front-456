import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { CartItem, CartPromoResult } from './cart.actions';

export interface CartState {
  items: CartItem[];
  promo: CartPromoResult | null;
  promoLoading: boolean;
  promoError: string | null;
}

export const initialState: CartState = {
  items: [],
  promo: null,
  promoLoading: false,
  promoError: null,
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
    ...initialState,
  })),

  on(CartActions.loadCartFromStorage, (state, { items }) => ({
    ...state,
    items,
  })),
  on(CartActions.applyPromoCode, (state) => ({
    ...state,
    promoLoading: true,
    promoError: null,
  })),
  on(CartActions.applyPromoSuccess, (state, { result }) => ({
    ...state,
    promo: result,
    promoLoading: false,
    promoError: null,
  })),
  on(CartActions.applyPromoFailure, (state, { error }) => ({
    ...state,
    promo: null,
    promoLoading: false,
    promoError: error,
  })),
  on(CartActions.clearCartPromo, (state) => ({
    ...state,
    promo: null,
    promoLoading: false,
    promoError: null,
  })),
);
