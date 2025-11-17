import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../state/auth/auth.selectors';
import { take, map } from 'rxjs/operators';

/**
 * AuthGuard - Protects routes that require authentication
 * 
 * Usage in app.routes.ts:
 * ```
 * {
 *   path: 'shop',
 *   canActivate: [authGuard],
 *   children: [...]
 * }
 * ```
 */

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }

      // Redirect to login if not authenticated
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    })
  );
};
