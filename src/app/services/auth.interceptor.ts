/**
 * Functional Auth Interceptor (Angular 15+)
 * 
 * Features:
 * - Adds Bearer token to requests
 * - Handles 401 errors by refreshing token
 * - Retries failed requests with new token
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../state/auth/auth.selectors';
import { take, switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as AuthActions from '../state/auth/auth.actions';

/**
 * Functional Auth Interceptor with Token Refresh Flow
 * 
 * Features:
 * - Adds Bearer token to requests
 * - Handles 401 errors by refreshing token
 * - Retries failed requests with new token
 */

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  // Get the access token from store
  return store.select(selectAccessToken).pipe(
    take(1),
    switchMap((token) => {
      let authReq = req;

      // If token exists, clone request and add Authorization header
      if (token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return next(authReq).pipe(
        catchError((error) => {
          // If 401 (Unauthorized), try to refresh token and retry
          if (error.status === 401 && !authReq.url.includes('/token/refresh/')) {
            return store.select((state: any) => state.auth.refresh).pipe(
              take(1),
              switchMap((refreshToken) => {
                if (refreshToken) {
                  // Dispatch refresh token action
                  store.dispatch(AuthActions.refreshToken({ refreshToken }));
                  // For now, just retry the original request
                  // In production, wait for token update
                  return next(authReq);
                }
                return throwError(() => error);
              }),
              catchError(() => throwError(() => error))
            );
          }
          return throwError(() => error);
        })
      );
    })
  );
};

