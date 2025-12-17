import { selectWishlistProducts, selectWishlistIds, selectWishlistCount, selectIsProductInWishlist } from './wishlist.selectors';

describe('WishlistSelectors', () => {
  const mockProducts = [
    { id: 1, name: 'Product 1', price: 10, avgRating: 4, created_at: '2024-01-01', description: '', stock: 10, lowStockThreshold: 5, reviews_count: 0, owner_id: 1, ratings: [] },
    { id: 2, name: 'Product 2', price: 20, avgRating: 5, created_at: '2024-01-02', description: '', stock: 20, lowStockThreshold: 5, reviews_count: 0, owner_id: 1, ratings: [] },
    { id: 3, name: 'Product 3', price: 30, avgRating: 3, created_at: '2024-01-03', description: '', stock: 30, lowStockThreshold: 5, reviews_count: 0, owner_id: 1, ratings: [] },
  ];

  describe('selectWishlistIds', () => {
    it('should return empty array for empty wishlist', () => {
      const state = { ids: [], loading: false, error: null };
      const result = selectWishlistIds.projector(state);
      expect(result).toEqual([]);
    });

    it('should return all wishlist ids', () => {
      const state = { ids: [1, 2, 3], loading: false, error: null };
      const result = selectWishlistIds.projector(state);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('selectWishlistCount', () => {
    it('should return 0 for empty wishlist', () => {
      const result = selectWishlistCount.projector([]);
      expect(result).toBe(0);
    });

    it('should return count of wishlist items', () => {
      const result = selectWishlistCount.projector([1, 2, 3]);
      expect(result).toBe(3);
    });
  });

  describe('selectWishlistProducts', () => {
    it('should return empty array when wishlist is empty', () => {
      const result = selectWishlistProducts.projector([], mockProducts);
      expect(result).toEqual([]);
    });

    it('should return products that are in wishlist', () => {
      const wishlistIds = [1, 3];
      const result = selectWishlistProducts.projector(wishlistIds, mockProducts);

      expect(result.length).toBe(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('should filter out products not in wishlist', () => {
      const wishlistIds = [2];
      const result = selectWishlistProducts.projector(wishlistIds, mockProducts);

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Product 2');
    });

    it('should handle wishlist ids that do not exist in products', () => {
      const wishlistIds = [1, 999]; // 999 doesn't exist
      const result = selectWishlistProducts.projector(wishlistIds, mockProducts);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe('selectIsProductInWishlist', () => {
    it('should return true if product is in wishlist', () => {
      const selector = selectIsProductInWishlist(1);
      const result = selector.projector([1, 2, 3]);
      expect(result).toBe(true);
    });

    it('should return false if product is not in wishlist', () => {
      const selector = selectIsProductInWishlist(99);
      const result = selector.projector([1, 2, 3]);
      expect(result).toBe(false);
    });

    it('should return false for empty wishlist', () => {
      const selector = selectIsProductInWishlist(1);
      const result = selector.projector([]);
      expect(result).toBe(false);
    });
  });
});
