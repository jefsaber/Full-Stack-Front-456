import { createReducer, on } from '@ngrx/store';
import * as ReviewsActions from './reviews.actions';
import { Review, ReviewsFetchOptions } from './review.model';

export interface ReviewsState {
  currentProductId: number | null;
  reviews: Review[];
  loading: boolean;
  error: string | null;
  posting: boolean;
  postError: string | null;
  average: number;
  count: number;
  lastFilters: ReviewsFetchOptions | null;
}

const initialState: ReviewsState = {
  currentProductId: null,
  reviews: [],
  loading: false,
  error: null,
  posting: false,
  postError: null,
  average: 0,
  count: 0,
  lastFilters: null,
};

export const reviewsReducer = createReducer(
  initialState,
  on(ReviewsActions.loadReviews, (state, { productId, filters }) => ({
    ...state,
    currentProductId: productId,
    loading: true,
    error: null,
    lastFilters: filters || state.lastFilters,
  })),
  on(ReviewsActions.loadReviewsSuccess, (state, { productId, reviews, average, count }) => ({
    ...state,
    currentProductId: productId,
    reviews,
    average,
    count,
    loading: false,
    error: null,
  })),
  on(ReviewsActions.loadReviewsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ReviewsActions.postReview, (state) => ({
    ...state,
    posting: true,
    postError: null,
  })),
  on(ReviewsActions.postReviewSuccess, (state) => ({
    ...state,
    posting: false,
    postError: null,
  })),
  on(ReviewsActions.postReviewFailure, (state, { error }) => ({
    ...state,
    posting: false,
    postError: error,
  }))
);
