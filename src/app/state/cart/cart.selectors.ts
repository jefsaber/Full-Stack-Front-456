import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';
import { CartItem } from './cart.actions';

const TAX_RATE = 0.19;
const SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5.99;

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

const defaultShipping = (subtotal: number): number => (subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE);
const defaultTaxes = (subtotal: number): number => roundToCents(subtotal * TAX_RATE);

export const selectCartFeature = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartFeature,
  (state: CartState) => state.items
);

export const selectCartCount = createSelector(
  selectCartItems,
  (items: CartItem[]) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartTotalItems = createSelector(
  selectCartItems,
  (items: CartItem[]) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartTotal = createSelector(
  selectCartItems,
  (items: CartItem[]) => items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartPromo = createSelector(
  selectCartFeature,
  (state: CartState) => state.promo
);

export const selectPromoLoading = createSelector(
  selectCartFeature,
  (state: CartState) => state.promoLoading
);

export const selectPromoError = createSelector(
  selectCartFeature,
  (state: CartState) => state.promoError
);

export const selectCartBreakdown = createSelector(
  selectCartTotal,
  selectCartPromo,
  (subtotal, promo) => {
    const discount = promo?.discount ?? 0;
    const shipping = promo?.shipping ?? defaultShipping(subtotal);
    const taxes = promo?.taxes ?? defaultTaxes(subtotal);
    const rawTotal = Math.max(0, subtotal - discount + shipping + taxes);
    const grandTotal = promo?.grandTotal ?? roundToCents(rawTotal);

    return {
      itemsTotal: subtotal,
      discount,
      shipping,
      taxes,
      grandTotal,
      appliedPromos: promo?.appliedPromos ?? [],
    };
  }
);

export const selectCartSubtotal = createSelector(
  selectCartBreakdown,
  (breakdown) => breakdown.itemsTotal
);

export const selectCartDiscount = createSelector(
  selectCartBreakdown,
  (breakdown) => breakdown.discount
);

export const selectShippingCost = createSelector(
  selectCartBreakdown,
  (breakdown) => breakdown.shipping
);

export const selectTaxes = createSelector(
  selectCartBreakdown,
  (breakdown) => breakdown.taxes
);

export const selectAppliedPromos = createSelector(
  selectCartBreakdown,
  (breakdown) => breakdown.appliedPromos
);

export const selectTotalWithShipping = createSelector(
  selectCartBreakdown,
  (breakdown) => breakdown.grandTotal
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
