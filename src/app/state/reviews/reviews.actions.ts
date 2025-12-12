import { createAction, props } from '@ngrx/store';
import { Review, ReviewsFetchOptions } from './review.model';

export const loadReviews = createAction(
  '[Reviews] Load Reviews',
  props<{ productId: number; filters?: ReviewsFetchOptions }>()
);

export const loadReviewsSuccess = createAction(
  '[Reviews] Load Reviews Success',
  props<{ productId: number; reviews: Review[]; average: number; count: number }>()
);

export const loadReviewsFailure = createAction(
  '[Reviews] Load Reviews Failure',
  props<{ error: string }>()
);

export const postReview = createAction(
  '[Reviews] Post Review',
  props<{ productId: number; rating: number; comment: string; author: string }>()
);

export const postReviewSuccess = createAction(
  '[Reviews] Post Review Success',
  props<{ review: Review }>()
);

export const postReviewFailure = createAction(
  '[Reviews] Post Review Failure',
  props<{ error: string }>()
);
