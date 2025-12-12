export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsFetchOptions {
  minRating?: number;
  sortBy?: 'recent' | 'rating';
}
