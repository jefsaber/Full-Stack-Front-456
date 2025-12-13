import { HttpResponse, HttpResponseResolver, http } from 'msw';
import { OrderDetail, OrderSummary } from '../app/state/user/user.actions';
import { ReviewsFetchOptions } from '../app/state/reviews/review.model';
import { avgRating } from './utils';
import { products } from './data';
import { addReview, getReviewStats, getReviewsForProduct } from './reviews';
import { MOCK_ADMIN_STATS } from '../app/services/admin-dashboard.service';

const ORDERS_KEY = 'userOrders';
const PROFILE_KEY = 'userProfile';

const defaultOrders: OrderDetail[] = [
  {
    id: '1001',
    date: '2025-12-01T12:34:00Z',
    total: 89.4,
    status: 'en_cours',
    itemCount: 3,
    items: [
      { productId: 1, productName: 'Stylo Bleu', quantity: 2, price: 2.5 },
      { productId: 10, productName: 'Bloc Notes', quantity: 1, price: 3 },
      { productId: 2, productName: 'Cahier A5', quantity: 5, price: 3.9 },
    ],
    subtotal: 34.7,
    tax: 5.2,
    shipping: 0,
    deliveryAddress: {
      street: "24 Avenue de l'Opéra",
      city: 'Paris',
      zipCode: '75002',
      country: 'France',
    },
    deliveryOption: 'standard',
    trackingUrl: 'https://example.com/track/ORD-1001',
  },
  {
    id: '1002',
    date: '2025-11-15T09:12:00Z',
    total: 142.75,
    status: 'expediee',
    itemCount: 4,
    items: [
      { productId: 5, productName: 'Règle 30cm', quantity: 3, price: 1.5 },
      { productId: 15, productName: 'Stylo Rouge', quantity: 2, price: 2.5 },
      { productId: 12, productName: 'Trousse Bleue', quantity: 1, price: 6.5 },
      { productId: 18, productName: 'Palette Aquarelle', quantity: 1, price: 9.5 },
    ],
    subtotal: 116.85,
    tax: 22.22,
    shipping: 3.68,
    deliveryAddress: {
      street: '8 Boulevard Saint-Germain',
      city: 'Paris',
      zipCode: '75006',
      country: 'France',
    },
    deliveryOption: 'express',
    trackingUrl: 'https://example.com/track/ORD-1002',
  },
];

const getStoredOrders = (): OrderDetail[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  if (!stored) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultOrders));
    return [...defaultOrders];
  }

  try {
    const parsed = JSON.parse(stored) as OrderDetail[];
    if (!parsed.length) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultOrders));
      return [...defaultOrders];
    }
    return parsed;
  } catch {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultOrders));
    return [...defaultOrders];
  }
};

const toOrderSummary = (order: OrderDetail): OrderSummary => ({
  id: order.id,
  date: order.date,
  total: order.total,
  status: order.status,
  itemCount: order.itemCount,
});

const defaultProfile = {
  fullName: 'Célestine Martin',
  email: 'celestine.martin@example.com',
  preferences: {
    newsletter: true,
    preferredRating: 4,
  },
};

const getStoredProfile = () => {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile));
    return { ...defaultProfile };
  }
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile));
    return { ...defaultProfile };
  }
};

const updateStoredProfile = (patch: Partial<typeof defaultProfile>) => {
  const current = getStoredProfile();
  const updated = {
    ...current,
    ...patch,
    preferences: {
      ...current.preferences,
      ...patch.preferences,
    },
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  return updated;
};

const sanitizeNumber = (value: string | null, fallback: number): number => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
};

type ProductSortableField = 'name' | 'price' | 'created_at' | 'stock' | 'rating';

const sortableFields: ProductSortableField[] = ['name', 'price', 'created_at', 'stock', 'rating'];

const buildOrderingTokens = (value: string): Array<{ field: ProductSortableField; direction: 1 | -1 }> => {
  return value
    .split(/[|,]/)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      const direction = token.startsWith('-') ? -1 : 1;
      const rawField = token.replace(/^[-+]/, '');
      if (!sortableFields.includes(rawField as ProductSortableField)) {
        return null;
      }
      return {
        field: rawField as ProductSortableField,
        direction,
      };
    })
    .filter((value): value is { field: ProductSortableField; direction: 1 | -1 } => !!value);
};

const sortProducts = (
  items: typeof products,
  tokens: Array<{ field: ProductSortableField; direction: 1 | -1 }>,
): typeof products => {
  if (!tokens.length) {
    return [...items];
  }

  const getValue = (item: typeof products[number], field: ProductSortableField): number | string => {
    if (field === 'rating') {
      return avgRating(item.ratings);
    }
    const key = field as keyof Omit<typeof products[number], 'ratings'>;
    const value = item[key];
    return typeof value === 'number' || typeof value === 'string' ? value : '';
  };

  return [...items].sort((a, b) => {
    for (const token of tokens) {
      const left = getValue(a, token.field);
      const right = getValue(b, token.field);

      if (typeof left === 'string' && typeof right === 'string') {
        const comparison = left.localeCompare(right);
        if (comparison !== 0) {
          return comparison * token.direction;
        }
        continue;
      }

      if (typeof left === 'number' && typeof right === 'number') {
        if (left < right) return -1 * token.direction;
        if (left > right) return 1 * token.direction;
        continue;
      }
    }
    return 0;
  });
};

const createPageUrl = (
  original: URLSearchParams,
  page: number,
  pageSize: number,
  minRating: number,
  ordering: string,
): string => {
  const params = new URLSearchParams(original);
  params.set('page', String(page));
  params.set('page_size', String(pageSize));
  if (minRating > 0) {
    params.set('min_rating', String(minRating));
  } else {
    params.delete('min_rating');
  }
  if (ordering) {
    params.set('ordering', ordering);
  } else {
    params.delete('ordering');
  }
  const queryString = params.toString();
  return queryString ? `/api/products/?${queryString}` : '/api/products/';
};

const handleProductList: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams;
  const page = Math.max(sanitizeNumber(query.get('page'), 1), 1);
  const pageSize = Math.max(sanitizeNumber(query.get('page_size'), 10), 1);
  const minRating = Math.max(sanitizeNumber(query.get('min_rating'), 0), 0);
  const ordering = query.get('ordering') ?? '';
  const tokens = buildOrderingTokens(ordering);

  const filtered = products.filter((product) => avgRating(product.ratings) >= minRating);
  const sorted = sortProducts(filtered, tokens);

  const start = (page - 1) * pageSize;
  const results = sorted
    .slice(start, start + pageSize)
    .map(({ id, name, price, created_at }) => ({ id, name, price, created_at }));
  const total = sorted.length;
  const basePageUrl = new URLSearchParams(query.toString());

  const next = start + pageSize < total ? createPageUrl(basePageUrl, page + 1, pageSize, minRating, ordering) : null;
  const previous = page > 1 ? createPageUrl(basePageUrl, page - 1, pageSize, minRating, ordering) : null;

  return HttpResponse.json({ count: total, next, previous, results });
};

const handleProductRating: HttpResponseResolver = ({ params }) => {
  const idParam = params['id'];
  const idString = Array.isArray(idParam) ? idParam[0] : idParam;
  const productId = Number(idString);
  if (!idString || Number.isNaN(productId)) {
    return HttpResponse.json({ detail: 'Product not found' }, { status: 404 });
  }

  const product = products.find((item) => item.id === productId);
  if (!product) {
    return HttpResponse.json({ detail: 'Product not found' }, { status: 404 });
  }

  const count = product.ratings.length;
  const avg = count ? Math.round(avgRating(product.ratings) * 100) / 100 : 0;
  return HttpResponse.json({ product_id: product.id, avg_rating: avg, count });
};

const parseProductId = (value: string | readonly string[] | null | undefined): number | null => {
  if (value == null) {
    return null;
  }
  const normalized = Array.isArray(value) ? value[0] : value;
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

const handleProductStock: HttpResponseResolver = ({ params }) => {
  const productId = parseProductId(params['id']);
  if (!productId) {
    return HttpResponse.json({ detail: 'Product not found' }, { status: 404 });
  }
  const product = products.find((item) => item.id === productId);
  if (!product) {
    return HttpResponse.json({ detail: 'Product not found' }, { status: 404 });
  }
  return HttpResponse.json({ product_id: product.id, stock: product.stock });
};

const handleValidateStock: HttpResponseResolver = async ({ request }) => {
  let payload: { items?: Array<{ productId: number; quantity: number }> };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return HttpResponse.json({ detail: 'Invalid payload' }, { status: 400 });
  }

  if (!payload?.items?.length) {
    return HttpResponse.json({ detail: 'No items provided' }, { status: 400 });
  }

  for (const item of payload.items) {
    if (!Number.isFinite(item.productId)) {
      return HttpResponse.json({ detail: 'Missing product id' }, { status: 400 });
    }
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      return HttpResponse.json({ detail: `Produit ${item.productId} introuvable` }, { status: 404 });
    }
    if (item.quantity > product.stock) {
      return HttpResponse.json(
        { detail: `Stock insuffisant pour le produit ${product.name}` },
        { status: 400 },
      );
    }
  }

  const summary = payload.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId)!;
    return {
      product_id: product.id,
      requested: item.quantity,
      available: product.stock,
    };
  });

  return HttpResponse.json({ valid: true, summary, message: 'Stock vérifié' });
};

const handleReviewsList: HttpResponseResolver = ({ request, params }) => {
  const productId = parseProductId(params['id']);
  if (!productId) {
    return HttpResponse.json({ detail: 'Product not found' }, { status: 404 });
  }
  const url = new URL(request.url);
  const minRatingParam = url.searchParams.get('min_rating');
  const sortByRaw = url.searchParams.get('sort_by');
  const computedSort: ReviewsFetchOptions['sortBy'] =
    sortByRaw === 'rating' ? 'rating' : sortByRaw === 'recent' ? 'recent' : undefined;
  const filters: ReviewsFetchOptions = {
    minRating: minRatingParam ? Number(minRatingParam) : undefined,
    sortBy: computedSort,
  };
  const reviews = getReviewsForProduct(productId, filters);
  const stats = getReviewStats(productId);
  return HttpResponse.json({ product_id: productId, count: reviews.length, average: stats.average, results: reviews });
};

const handleReviewPost: HttpResponseResolver = async ({ request, params }) => {
  const productId = parseProductId(params['id']);
  if (!productId) {
    return HttpResponse.json({ detail: 'Product not found' }, { status: 404 });
  }
  let payload: { author?: string; rating?: number; comment?: string };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return HttpResponse.json({ detail: 'Invalid request body' }, { status: 400 });
  }
  if (payload.rating == null || payload.comment == null) {
    return HttpResponse.json({ detail: 'Rating and comment are required' }, { status: 400 });
  }
  try {
    const review = addReview(productId, payload.author || 'Client', payload.rating, payload.comment);
    return HttpResponse.json(review, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save review';
    return HttpResponse.json({ detail: message }, { status: 400 });
  }
};

const handleProfileGet: HttpResponseResolver = () => {
  return HttpResponse.json(getStoredProfile());
};

const handleProfilePatch: HttpResponseResolver = async ({ request }) => {
  let payload: Partial<typeof defaultProfile>;
  try {
    payload = (await request.json()) as Partial<typeof defaultProfile>;
  } catch {
    return HttpResponse.json({ detail: 'Invalid payload' }, { status: 400 });
  }
  const updated = updateStoredProfile(payload);
  return HttpResponse.json(updated);
};

export const handlers = [
  http.post('/api/auth/token/', () =>
    HttpResponse.json({ access: 'mock-access-token', refresh: 'mock-refresh-token' }),
  ),

  http.post('/api/auth/token/refresh/', () => HttpResponse.json({ access: 'mock-access-token' })),

  http.get('/api/products/', handleProductList),
  http.get('/api/products', handleProductList),
  http.get('/api/products/:id/rating/', handleProductRating),
  http.get('/api/products/:id/rating', handleProductRating),
  http.get('/api/products/:id/stock/', handleProductStock),
  http.get('/api/products/:id/stock', handleProductStock),
  http.post('/api/cart/validate-stock/', handleValidateStock),
  http.post('/api/cart/validate-stock', handleValidateStock),
  http.get('/api/products/:id/reviews/', handleReviewsList),
  http.get('/api/products/:id/reviews', handleReviewsList),
  http.post('/api/products/:id/reviews/', handleReviewPost),
  http.post('/api/products/:id/reviews', handleReviewPost),

  http.get('/api/admin/stats/', () => HttpResponse.json(MOCK_ADMIN_STATS)),
  http.get('/api/admin/stats', () => HttpResponse.json(MOCK_ADMIN_STATS)),

  http.get('/api/me/orders/', () => {
    const orders = getStoredOrders();
    const summaries = orders.map(toOrderSummary);
    return HttpResponse.json(summaries);
  }),

  http.get('/api/me/', handleProfileGet),
  http.patch('/api/me/', handleProfilePatch),

  http.get('/api/orders/:orderId/', ({ params }) => {
    const orderIdParam = params['orderId'];
    const orderIdString = Array.isArray(orderIdParam) ? orderIdParam[0] : orderIdParam;
    if (!orderIdString) {
      return HttpResponse.json({ detail: 'Order not found' }, { status: 404 });
    }
    const orders = getStoredOrders();
    const order = orders.find((item) => item.id === orderIdString);
    if (!order) {
      return HttpResponse.json({ detail: 'Order not found' }, { status: 404 });
    }
    return HttpResponse.json(order);
  }),
];
