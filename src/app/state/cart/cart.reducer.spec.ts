import { cartReducer, initialState, CartState } from './cart.reducer';
import * as CartActions from './cart.actions';
import { CartItem } from './cart.actions';

describe('CartReducer', () => {
  const mockProduct: Omit<CartItem, 'quantity'> = {
    id: 1,
    name: 'Test Product',
    price: 29.99,
    avgRating: 4.5,
  };

  const mockProduct2: Omit<CartItem, 'quantity'> = {
    id: 2,
    name: 'Another Product',
    price: 19.99,
    avgRating: 3.5,
  };

  describe('addItem', () => {
    it('should add a new item to empty cart', () => {
      const action = CartActions.addItem({ product: mockProduct, quantity: 1 });
      const state = cartReducer(initialState, action);

      expect(state.items.length).toBe(1);
      expect(state.items[0]).toEqual({ ...mockProduct, quantity: 1 });
    });

    it('should increment quantity when adding existing item', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ ...mockProduct, quantity: 2 }],
      };

      const action = CartActions.addItem({ product: mockProduct, quantity: 3 });
      const state = cartReducer(stateWithItem, action);

      expect(state.items.length).toBe(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it('should add multiple different items', () => {
      const action1 = CartActions.addItem({ product: mockProduct, quantity: 1 });
      const state1 = cartReducer(initialState, action1);

      const action2 = CartActions.addItem({ product: mockProduct2, quantity: 2 });
      const state2 = cartReducer(state1, action2);

      expect(state2.items.length).toBe(2);
      expect(state2.items[0].id).toBe(1);
      expect(state2.items[1].id).toBe(2);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ ...mockProduct, quantity: 2 }],
      };

      const action = CartActions.updateQuantity({ productId: 1, quantity: 5 });
      const state = cartReducer(stateWithItem, action);

      expect(state.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ ...mockProduct, quantity: 2 }],
      };

      const action = CartActions.updateQuantity({ productId: 1, quantity: 0 });
      const state = cartReducer(stateWithItem, action);

      expect(state.items.length).toBe(0);
    });

    it('should remove item when quantity is negative', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ ...mockProduct, quantity: 2 }],
      };

      const action = CartActions.updateQuantity({ productId: 1, quantity: -1 });
      const state = cartReducer(stateWithItem, action);

      expect(state.items.length).toBe(0);
    });

    it('should recalculate total when quantity changes (verify via state)', () => {
      const stateWithItems: CartState = {
        ...initialState,
        items: [
          { ...mockProduct, quantity: 2 },  // 2 * 29.99 = 59.98
          { ...mockProduct2, quantity: 1 }, // 1 * 19.99 = 19.99
        ],
      };

      const action = CartActions.updateQuantity({ productId: 1, quantity: 3 }); // 3 * 29.99 = 89.97
      const state = cartReducer(stateWithItems, action);

      // Calculate expected total: (3 * 29.99) + (1 * 19.99) = 109.96
      const expectedTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(expectedTotal).toBeCloseTo(109.96, 2);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const stateWithItems: CartState = {
        ...initialState,
        items: [
          { ...mockProduct, quantity: 2 },
          { ...mockProduct2, quantity: 1 },
        ],
      };

      const action = CartActions.removeItem({ productId: 1 });
      const state = cartReducer(stateWithItems, action);

      expect(state.items.length).toBe(1);
      expect(state.items[0].id).toBe(2);
    });

    it('should recalculate total after removal', () => {
      const stateWithItems: CartState = {
        ...initialState,
        items: [
          { ...mockProduct, quantity: 2 },  // 59.98
          { ...mockProduct2, quantity: 1 }, // 19.99
        ],
      };

      const action = CartActions.removeItem({ productId: 1 });
      const state = cartReducer(stateWithItems, action);

      // Only product2 remains
      const expectedTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(expectedTotal).toBeCloseTo(19.99, 2);
    });

    it('should handle removing non-existent item', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ ...mockProduct, quantity: 2 }],
      };

      const action = CartActions.removeItem({ productId: 999 });
      const state = cartReducer(stateWithItem, action);

      expect(state.items.length).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('should clear all items', () => {
      const stateWithItems: CartState = {
        ...initialState,
        items: [
          { ...mockProduct, quantity: 2 },
          { ...mockProduct2, quantity: 1 },
        ],
      };

      const action = CartActions.clearCart();
      const state = cartReducer(stateWithItems, action);

      expect(state.items.length).toBe(0);
      expect(state).toEqual(initialState);
    });
  });
});
