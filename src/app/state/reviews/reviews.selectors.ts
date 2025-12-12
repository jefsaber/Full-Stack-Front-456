import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReviewsState } from './reviews.reducer';

const reviewsFeatureKey = 'reviews';

export const selectReviewsState = createFeatureSelector<ReviewsState>(reviewsFeatureKey);

export const selectReviewList = createSelector(
  selectReviewsState,
  (state) => state.reviews
);

export const selectReviewAverage = createSelector(
  selectReviewsState,
  (state) => state.average
);

export const selectReviewCount = createSelector(
  selectReviewsState,
  (state) => state.count
);

export const selectReviewLoading = createSelector(
  selectReviewsState,
  (state) => state.loading
);

export const selectReviewError = createSelector(
  selectReviewsState,
  (state) => state.error
);

export const selectReviewPosting = createSelector(
  selectReviewsState,
  (state) => state.posting
);

export const selectReviewPostError = createSelector(
  selectReviewsState,
  (state) => state.postError
);

export const selectReviewFilters = createSelector(
  selectReviewsState,
  (state) => state.lastFilters
);

export const selectReviewProductId = createSelector(
  selectReviewsState,
  (state) => state.currentProductId
);
