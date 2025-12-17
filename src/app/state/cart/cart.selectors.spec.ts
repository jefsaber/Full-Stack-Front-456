import { selectCartTotalItems, selectCartTotal, selectCartBreakdown } from './cart.selectors';
import { CartState } from './cart.reducer';

describe('CartSelectors', () => {
  describe('selectCartTotalItems', () => {
    it('should return 0 for empty cart', () => {
      const state: CartState = {
        items: [],
        promo: null,
        promoLoading: false,
        promoError: null,
      };

      const result = selectCartTotalItems.projector(state.items);
      expect(result).toBe(0);
    });

    it('should return total quantity of all items', () => {
      const items = [
        { id: 1, name: 'Product 1', price: 10, quantity: 2, avgRating: 4 },
        { id: 2, name: 'Product 2', price: 20, quantity: 3, avgRating: 5 },
      ];

      const result = selectCartTotalItems.projector(items);
      expect(result).toBe(5);
    });

    it('should handle single item', () => {
      const items = [
        { id: 1, name: 'Product 1', price: 10, quantity: 7, avgRating: 4 },
      ];

      const result = selectCartTotalItems.projector(items);
      expect(result).toBe(7);
    });
  });

  describe('selectCartTotal', () => {
    it('should return 0 for empty cart', () => {
      const result = selectCartTotal.projector([]);
      expect(result).toBe(0);
    });

    it('should calculate total price correctly', () => {
      const items = [
        { id: 1, name: 'Product 1', price: 10.00, quantity: 2, avgRating: 4 }, // 20
        { id: 2, name: 'Product 2', price: 15.50, quantity: 3, avgRating: 5 }, // 46.50
      ];

      const result = selectCartTotal.projector(items);
      expect(result).toBeCloseTo(66.50, 2);
    });
  });

  describe('selectCartBreakdown', () => {
    it('should calculate breakdown without promo', () => {
      const subtotal = 100;
      const promo = null;

      const result = selectCartBreakdown.projector(subtotal, promo);

      expect(result.itemsTotal).toBe(100);
      expect(result.discount).toBe(0);
      expect(result.shipping).toBe(0); // Free shipping over 50
      expect(result.taxes).toBeCloseTo(19, 2); // 19% tax
      expect(result.grandTotal).toBeCloseTo(119, 2);
      expect(result.appliedPromos).toEqual([]);
    });

    it('should apply shipping fee for orders under 50', () => {
      const subtotal = 30;
      const promo = null;

      const result = selectCartBreakdown.projector(subtotal, promo);

      expect(result.shipping).toBe(5.99);
      expect(result.taxes).toBeCloseTo(5.70, 2); // 30 * 0.19
      expect(result.grandTotal).toBeCloseTo(41.69, 2); // 30 + 5.99 + 5.70
    });

    it('should use promo values when available', () => {
      const subtotal = 100;
      const promo = {
        itemsTotal: 100,
        discount: 20,
        shipping: 0,
        taxes: 15.20,
        grandTotal: 95.20,
        appliedPromos: ['SAVE20'],
      };

      const result = selectCartBreakdown.projector(subtotal, promo);

      expect(result.discount).toBe(20);
      expect(result.grandTotal).toBe(95.20);
      expect(result.appliedPromos).toEqual(['SAVE20']);
    });
  });
});
