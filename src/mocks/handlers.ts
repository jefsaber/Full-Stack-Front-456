/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { paginate, avgRating } from './utils';

const API = 'http://localhost:8000/api';

export const handlers = [
  // Auth: POST /api/auth/token/ -> { access, refresh }
  http.post(`${API}/auth/token/`, async () => {
    // Ici on accepte tout payload pour valider l'intégration front.
    return HttpResponse.json(
      {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      },
      { status: 200 },
    );
  }),

  // Auth refresh: POST /api/auth/token/refresh/ -> { access }
  http.post(`${API}/auth/token/refresh/`, async () => {
    return HttpResponse.json({ access: 'mock-access-token-refreshed' }, { status: 200 });
  }),

  // Products list: GET /api/products/?page=&page_size=&min_rating=&ordering=
  http.get(`${API}/products/`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const page_size = Number(url.searchParams.get('page_size') || '10');
    const min_rating = Number(url.searchParams.get('min_rating') || '0');
    const ordering = url.searchParams.get('ordering') || '-created_at';

    const rows = products
      .map((p) => ({ ...p, _avg: avgRating(p.ratings) }))
      .filter((p) => p._avg >= min_rating);

    const sign = ordering.startsWith('-') ? -1 : 1;
    const key = ordering.replace(/^-/, '');
    rows.sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign);

    const { count, results } = paginate(rows, page, page_size);
    return HttpResponse.json({ count, next: null, previous: null, results }, { status: 200 });
  }),

  // Product rating: GET /api/products/:id/rating/
  http.get(`${API}/products/:id/rating/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(
      { product_id: id, avg_rating: avgRating(p.ratings), count: p.ratings.length },
      { status: 200 },
    );
  }),

  // Product details: GET /api/products/:id/
  http.get(`${API}/products/:id/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(
      {
        id: p.id,
        name: p.name,
        price: p.price,
        created_at: p.created_at,
        avgRating: avgRating(p.ratings),
        description: `Premium quality ${p.name}. Highly rated by customers. Available in stock.`,
        stock: Math.floor(Math.random() * 50) + 1,
        reviews_count: p.ratings.length,
      },
      { status: 200 },
    );
  }),

  // Cart validation: POST /api/cart/validate/
  http.post(`${API}/cart/validate/`, async ({ request }) => {
    const body = await request.json() as any;
    const items = body.items || [];
    
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + (item.price * item.quantity),
      0
    );
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const tax = subtotal * 0.19; // 19% VAT
    const total = subtotal + shipping + tax;

    return HttpResponse.json(
      {
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      },
      { status: 200 },
    );
  }),

  // Order creation: POST /api/order/
  http.post(`${API}/order/`, async ({ request }) => {
    const body = await request.json() as any;
    const orderNumber = 'ORD-' + Date.now();
    
    return HttpResponse.json(
      {
        order_number: orderNumber,
        status: 'confirmed',
        total: body.total,
        delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        tracking_url: 'https://example.com/track/' + orderNumber,
      },
      { status: 201 },
    );
  }),

  // Get user profile: GET /api/me/
  http.get(`${API}/me/`, async () => {
    return HttpResponse.json(
      {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        defaultAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          zipCode: '75001',
          country: 'France',
        },
        preferences: {
          newsletter: true,
          defaultMinRating: 3,
        },
        orders: [
          {
            id: '1',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            total: 127.99,
            status: 'livree',
            itemCount: 3,
          },
          {
            id: '2',
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            total: 54.50,
            status: 'livree',
            itemCount: 2,
          },
          {
            id: '3',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            total: 89.99,
            status: 'expediee',
            itemCount: 1,
          },
        ],
      },
      { status: 200 },
    );
  }),

  // Update user preferences: PATCH /api/me/
  http.patch(`${API}/me/`, async ({ request }) => {
    const body = await request.json() as any;
    const preferences = body.preferences || {};
    
    return HttpResponse.json(
      {
        newsletter: preferences.newsletter ?? true,
        defaultMinRating: preferences.defaultMinRating ?? 0,
      },
      { status: 200 },
    );
  }),

  // Get user orders: GET /api/me/orders/
  http.get(`${API}/me/orders/`, async () => {
    return HttpResponse.json(
      [
        {
          id: '1',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          total: 127.99,
          status: 'livree',
          itemCount: 3,
        },
        {
          id: '2',
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          total: 54.50,
          status: 'livree',
          itemCount: 2,
        },
        {
          id: '3',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          total: 89.99,
          status: 'expediee',
          itemCount: 1,
        },
      ],
      { status: 200 },
    );
  }),

  // Get order details: GET /api/orders/:id/
  http.get(`${API}/orders/:id/`, async ({ params }) => {
    const id = params['id'];
    const orderId = String(id);

    // Mock data for different orders
    const orderData: Record<string, any> = {
      '1': {
        id: '1',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        total: 127.99,
        status: 'livree',
        itemCount: 3,
        items: [
          {
            productId: 1,
            productName: 'Gaming Mouse Pro',
            quantity: 1,
            price: 49.99,
          },
          {
            productId: 2,
            productName: 'Mechanical Keyboard RGB',
            quantity: 1,
            price: 59.99,
          },
          {
            productId: 3,
            productName: 'USB-C Cable Pack',
            quantity: 2,
            price: 9.00,
          },
        ],
        subtotal: 99.99,
        tax: 19.00,
        shipping: 9.00,
        deliveryAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          zipCode: '75001',
          country: 'France',
        },
        deliveryOption: 'standard',
        trackingUrl: 'https://example.com/track/ORD-001',
      },
      '2': {
        id: '2',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        total: 54.50,
        status: 'livree',
        itemCount: 2,
        items: [
          {
            productId: 4,
            productName: 'Monitor Stand',
            quantity: 1,
            price: 39.99,
          },
          {
            productId: 5,
            productName: 'Desk Lamp LED',
            quantity: 1,
            price: 12.00,
          },
        ],
        subtotal: 40.00,
        tax: 7.60,
        shipping: 6.90,
        deliveryAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          zipCode: '75001',
          country: 'France',
        },
        deliveryOption: 'standard',
        trackingUrl: 'https://example.com/track/ORD-002',
      },
      '3': {
        id: '3',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        total: 89.99,
        status: 'expediee',
        itemCount: 1,
        items: [
          {
            productId: 6,
            productName: 'Premium Webcam 4K',
            quantity: 1,
            price: 75.99,
          },
        ],
        subtotal: 75.99,
        tax: 14.44,
        shipping: -0.44, // Free shipping (subtotal > 50)
        deliveryAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          zipCode: '75001',
          country: 'France',
        },
        deliveryOption: 'express',
        trackingUrl: 'https://example.com/track/ORD-003',
      },
    };

    const order = orderData[orderId];
    if (!order) {
      return HttpResponse.json({ detail: 'Order not found.' }, { status: 404 });
    }

    return HttpResponse.json(order, { status: 200 });
  }),
];
