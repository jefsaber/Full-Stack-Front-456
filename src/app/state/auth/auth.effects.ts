import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, delay } from 'rxjs/operators';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      map(({ username, password }) => {
        // Static mock login - accept any credentials
        // Simulate network delay
        return AuthActions.loginSuccess({
          access: 'mock-access-token-' + Date.now(),
          refresh: 'mock-refresh-token-' + Date.now(),
        });
      })
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      map(({ refreshToken }) => {
        // Validate refresh token is not expired
        if (!refreshToken || refreshToken.includes('expired')) {
          return AuthActions.refreshTokenFailure({
            error: 'Refresh token expired. Please log in again.',
          });
        }

        // Generate new access token
        return AuthActions.refreshTokenSuccess({
          access: 'mock-access-token-refreshed-' + Date.now(),
        });
      })
    )
  );

  refreshTokenFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenFailure),
        map(({ error }) => {
          console.warn('[Auth Effects] Token refresh failed:', error);
          // Component or interceptor should handle redirect to login
        })
      ),
    { dispatch: false }
  );
}
