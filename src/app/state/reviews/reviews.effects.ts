import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ReviewsActions from './reviews.actions';
import { selectReviewFilters, selectReviewProductId } from './reviews.selectors';
import { addReview, getReviewsForProduct, getReviewStats } from '../../../mocks/reviews';

@Injectable()
export class ReviewsEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  loadReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadReviews),
      map(({ productId, filters }) => {
        const reviews = getReviewsForProduct(productId, filters);
        const stats = getReviewStats(productId);
        return ReviewsActions.loadReviewsSuccess({
          productId,
          reviews,
          average: stats.average,
          count: stats.count,
        });
      })
    )
  );

  postReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.postReview),
      mergeMap(({ productId, rating, comment, author }) => {
        try {
          const review = addReview(productId, author, rating, comment);
          return of(ReviewsActions.postReviewSuccess({ review }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to save review';
          return of(ReviewsActions.postReviewFailure({ error: message }));
        }
      })
    )
  );

  refreshAfterPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.postReviewSuccess),
      withLatestFrom(
        this.store.select(selectReviewProductId),
        this.store.select(selectReviewFilters)
      ),
      map(([{ review }, productId, filters]) => {
        const targetProductId = productId ?? review.productId;
        return ReviewsActions.loadReviews({ productId: targetProductId, filters: filters || undefined });
      })
    )
  );
}
