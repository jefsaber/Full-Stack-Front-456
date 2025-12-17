import { selectOrdersByStatus, selectUserOrders, selectOrdersGroupedByStatus, selectUserOrderStats } from './user.selectors';
import { OrderSummary } from './user.actions';

describe('UserSelectors', () => {
  const mockOrders: OrderSummary[] = [
    { id: '1', date: '2024-01-01', total: 100, status: 'en_cours', itemCount: 2 },
    { id: '2', date: '2024-01-02', total: 200, status: 'expediee', itemCount: 3 },
    { id: '3', date: '2024-01-03', total: 150, status: 'livree', itemCount: 1 },
    { id: '4', date: '2024-01-04', total: 75, status: 'expediee', itemCount: 1 },
    { id: '5', date: '2024-01-05', total: 300, status: 'livree', itemCount: 5 },
  ];

  describe('selectOrdersByStatus', () => {
    it('should return orders with status "expediee" (shipped)', () => {
      const selector = selectOrdersByStatus('expediee');
      const result = selector.projector(mockOrders);

      expect(result.length).toBe(2);
      expect(result.every(o => o.status === 'expediee')).toBe(true);
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('4');
    });

    it('should return orders with status "en_cours" (pending)', () => {
      const selector = selectOrdersByStatus('en_cours');
      const result = selector.projector(mockOrders);

      expect(result.length).toBe(1);
      expect(result[0].status).toBe('en_cours');
    });

    it('should return orders with status "livree" (delivered)', () => {
      const selector = selectOrdersByStatus('livree');
      const result = selector.projector(mockOrders);

      expect(result.length).toBe(2);
      expect(result.every(o => o.status === 'livree')).toBe(true);
    });

    it('should return empty array for status with no orders', () => {
      const emptyOrders: OrderSummary[] = [];
      const selector = selectOrdersByStatus('expediee');
      const result = selector.projector(emptyOrders);

      expect(result).toEqual([]);
    });
  });

  describe('selectOrdersGroupedByStatus', () => {
    it('should group orders by status', () => {
      const result = selectOrdersGroupedByStatus.projector(mockOrders);

      expect(result.pending.length).toBe(1);
      expect(result.shipped.length).toBe(2);
      expect(result.delivered.length).toBe(2);
    });

    it('should handle empty orders', () => {
      const result = selectOrdersGroupedByStatus.projector([]);

      expect(result.pending).toEqual([]);
      expect(result.shipped).toEqual([]);
      expect(result.delivered).toEqual([]);
    });
  });

  describe('selectUserOrderStats', () => {
    it('should calculate total spent correctly', () => {
      const result = selectUserOrderStats.projector(mockOrders);

      // 100 + 200 + 150 + 75 + 300 = 825
      expect(result.totalSpent).toBe(825);
    });

    it('should count orders correctly', () => {
      const result = selectUserOrderStats.projector(mockOrders);
      expect(result.count).toBe(5);
    });

    it('should find the last order date', () => {
      const result = selectUserOrderStats.projector(mockOrders);

      expect(result.lastOrderDate).not.toBeNull();
      expect(result.lastOrderDate!.toISOString()).toContain('2024-01-05');
    });

    it('should handle empty orders', () => {
      const result = selectUserOrderStats.projector([]);

      expect(result.count).toBe(0);
      expect(result.totalSpent).toBe(0);
      expect(result.lastOrderDate).toBeNull();
    });
  });
});
