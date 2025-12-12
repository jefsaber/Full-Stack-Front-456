import { Review, ReviewsFetchOptions } from '../app/state/reviews/review.model';

const STORAGE_KEY = 'mock_reviews';

const defaultReviews: Review[] = [
  {
    id: 1,
    productId: 1,
    author: 'Camille Durand',
    rating: 5,
    comment: 'La prise en main est vraiment fluide et l encre glisse sans effort.',
    createdAt: '2025-11-10T14:23:00Z',
  },
  {
    id: 2,
    productId: 1,
    author: 'Matthieu Blondel',
    rating: 4,
    comment: 'Idem pour les notes rapides, c est un objet du quotidien bien robuste.',
    createdAt: '2025-11-08T11:30:00Z',
  },
  {
    id: 3,
    productId: 2,
    author: 'Lea Moreau',
    rating: 5,
    comment: 'Ce cahier A5 est parfait pour mon bullet journal.',
    createdAt: '2025-10-24T09:10:00Z',
  },
  {
    id: 4,
    productId: 2,
    author: 'Julien Roussel',
    rating: 4,
    comment: 'Feuilles lisse et pages qui ne se corn ent pas facilement.',
    createdAt: '2025-10-20T08:45:00Z',
  },
  {
    id: 5,
    productId: 3,
    author: 'Nora Simon',
    rating: 5,
    comment: 'Le classeur ne se dechire pas et garde mes documents alignes.',
    createdAt: '2025-09-30T12:15:00Z',
  },
  {
    id: 6,
    productId: 4,
    author: 'Romain Pires',
    rating: 3,
    comment: 'Un crayon simple mais correct pour les esquisses rapides.',
    createdAt: '2025-09-18T16:40:00Z',
  },
  {
    id: 7,
    productId: 5,
    author: 'Sara Fontaine',
    rating: 4,
    comment: 'Rien a redire sur la precision de la regle.',
    createdAt: '2025-08-21T10:20:00Z',
  },
  {
    id: 8,
    productId: 5,
    author: 'Vasile Morin',
    rating: 5,
    comment: 'Solide, la transparence reste propre meme apres plusieurs utilisations.',
    createdAt: '2025-08-05T14:55:00Z',
  },
];

const isBrowser = typeof window !== 'undefined' && !!window.localStorage;

const persistedReviews = isBrowser ? readStoredReviews() : null;

let reviewsStore: Review[] = persistedReviews
  ? persistedReviews
  : defaultReviews.map((review) => ({ ...review }));

let nextReviewId = reviewsStore.reduce((maxId, review) => Math.max(maxId, review.id), 0);

function readStoredReviews(): Review[] | null {
  if (!isBrowser) {
    return null;
  }

  const serialized = window.localStorage.getItem(STORAGE_KEY);
  if (!serialized) {
    return null;
  }

  try {
    const parsed = JSON.parse(serialized) as Review[];
    return parsed;
  } catch (error) {
    console.warn('Unable to read stored reviews', error);
    return null;
  }
}

function persistReviews(): void {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsStore));
}

export function getReviewsForProduct(productId: number, filters?: ReviewsFetchOptions): Review[] {
  let list = reviewsStore.filter((review) => review.productId === productId);

  if (filters?.minRating) {
    list = list.filter((review) => review.rating >= filters.minRating!);
  }

  const sorted = [...list].sort((a, b) => {
    if (filters?.sortBy === 'rating') {
      return b.rating - a.rating;
    }
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return diff;
  });

  return sorted;
}

export function getReviewStats(productId: number): { average: number; count: number } {
  const list = reviewsStore.filter((review) => review.productId === productId);
  const count = list.length;
  if (!count) {
    return { average: 0, count: 0 };
  }
  const average = list.reduce((sum, review) => sum + review.rating, 0) / count;
  return { average, count };
}

export function addReview(productId: number, author: string, rating: number, comment: string): Review {
  if (rating < 1 || rating > 5) {
    throw new Error('La note doit etre entre 1 et 5.');
  }

  const cleanedComment = comment.trim();
  if (!cleanedComment) {
    throw new Error('Le commentaire ne peut pas etre vide.');
  }

  const review: Review = {
    id: ++nextReviewId,
    productId,
    author: author || 'Client',
    rating,
    comment: cleanedComment,
    createdAt: new Date().toISOString(),
  };

  reviewsStore = [review, ...reviewsStore];
  persistReviews();
  return review;
}
