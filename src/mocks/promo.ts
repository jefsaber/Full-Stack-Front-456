import { CartItem, CartPromoResult } from '../app/state/cart/cart.actions';

const TAX_RATE = 0.19;
const SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5.99;
const VIP_MIN_TOTAL = 150;

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

const computeSubtotal = (items: CartItem[]): number =>
  roundToCents(items.reduce((sum, item) => sum + item.price * item.quantity, 0));

const defaultShipping = (subtotal: number): number =>
  subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

const defaultTaxes = (subtotal: number): number =>
  roundToCents(subtotal * TAX_RATE);

export const applyPromoCode = (items: CartItem[], code: string): CartPromoResult => {
  const normalized = (code || '').trim().toUpperCase();
  if (!normalized) {
    throw new Error('Veuillez saisir un code promo.');
  }

  const subtotal = computeSubtotal(items);
  const taxes = defaultTaxes(subtotal);
  let discount = 0;
  let shipping = defaultShipping(subtotal);
  const appliedPromos: string[] = [];

  switch (normalized) {
    case 'WELCOME10':
      discount = roundToCents(subtotal * 0.1);
      appliedPromos.push('WELCOME10');
      break;
    case 'FREESHIP':
      shipping = 0;
      appliedPromos.push('FREESHIP');
      break;
    case 'VIP20':
      if (subtotal < VIP_MIN_TOTAL) {
        throw new Error(`VIP20 requires orders of at least €${VIP_MIN_TOTAL.toFixed(2)}.`);
      }
      discount = roundToCents(subtotal * 0.2);
      appliedPromos.push('VIP20');
      break;
    default:
      throw new Error('Code promo invalide.');
  }

  const total = Math.max(0, subtotal - discount + shipping + taxes);
  return {
    itemsTotal: subtotal,
    discount,
    shipping,
    taxes,
    grandTotal: roundToCents(total),
    appliedPromos,
  };
};
