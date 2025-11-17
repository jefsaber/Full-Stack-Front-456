import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, delay } from 'rxjs/operators';
import * as AuthActions from './auth.actions';

/**
 * Auth Effects - Handles Auth-related side effects
 * 
 * Features:
 * - Mock login with instant token generation
 * - Token refresh with automatic renewal
 * - All tokens are static mock tokens (no backend required)
 */

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);

  /**
   * Login Effect - Generates mock tokens instantly
   * 
   * In a real app, this would call /api/auth/login/
   */
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

  /**
   * Token Refresh Effect - Renews expired tokens
   * 
   * Called when:
   * 1. Access token expires (interceptor detects 401)
   * 2. Manually triggered for long-lived sessions
   * 
   * In a real app, this would call /api/auth/token/refresh/
   */
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

  /**
   * Token Refresh Failure Effect - Handles refresh failures
   * 
   * When token refresh fails:
   * 1. Clear auth state
   * 2. Redirect to login (handled by component)
   */
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
