import { Injectable } from '@angular/core';
import { OrderDetail, OrderSummary } from '../state/user/user.actions';

@Injectable({
  providedIn: 'root',
})
export class OrdersStorageService {
  private readonly ORDERS_KEY = 'userOrders';

  constructor() {
    // Initialize with empty orders if none exist
    if (!localStorage.getItem(this.ORDERS_KEY)) {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify([]));
    }
  }

  /**
   * Add a new order from checkout
   */
  addOrder(orderData: any): OrderDetail {
    const orders = this.getAllOrdersFromStorage();
    
    const newOrder: OrderDetail = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      total: orderData.total,
      status: 'en_cours',
      itemCount: orderData.items?.length || 0,
      items: (orderData.items || []).map((item: any) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: orderData.subtotal || (orderData.items || []).reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      tax: orderData.tax || 0,
      shipping: orderData.shipping || 0,
      deliveryAddress: {
        street: orderData.address?.street || '',
        city: orderData.address?.city || '',
        zipCode: orderData.address?.zipCode || '',
        country: orderData.address?.country || '',
      },
      deliveryOption: orderData.deliveryOption || 'standard',
      trackingUrl: `https://example.com/track/ORD-${Date.now()}`,
    };

    orders.push(newOrder);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
  }

  /**
   * Get all orders
   */
  getAllOrders(): OrderSummary[] {
    return this.getAllOrdersFromStorage().map((order: OrderDetail) => ({
      id: order.id,
      date: order.date,
      total: order.total,
      status: order.status,
      itemCount: order.itemCount,
    }));
  }

  /**
   * Get a specific order by ID
   */
  getOrderById(orderId: string): OrderDetail | null {
    const orders = this.getAllOrdersFromStorage();
    return orders.find((order: OrderDetail) => order.id === orderId) || null;
  }

  /**
   * Get all orders from localStorage
   */
  private getAllOrdersFromStorage(): OrderDetail[] {
    const stored = localStorage.getItem(this.ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
