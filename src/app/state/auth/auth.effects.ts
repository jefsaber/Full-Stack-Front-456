import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly notification = inject(NotificationService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      map(({ username, password }) => {
        // Simulate login validation - reject empty credentials or specific test case
        if (!username || !password) {
          return AuthActions.loginFailure({
            error: 'Identifiants requis. Veuillez renseigner votre nom d\'utilisateur et mot de passe.',
          });
        }

        // Reject specific test credentials to demonstrate failure
        if (username === 'invalid' || password === 'wrong') {
          return AuthActions.loginFailure({
            error: 'Identifiants incorrects. Veuillez vérifier votre nom d\'utilisateur et mot de passe.',
          });
        }

        // Success case
        return AuthActions.loginSuccess({
          access: 'mock-access-token-' + Date.now(),
          refresh: 'mock-refresh-token-' + Date.now(),
        });
      })
    )
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          this.notification.error(error);
        })
      ),
    { dispatch: false }
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.notification.success('Connexion réussie !');
        })
      ),
    { dispatch: false }
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
        tap(({ error }) => {
          this.notification.error('Session expirée. Veuillez vous reconnecter.');
          console.warn('[Auth Effects] Token refresh failed:', error);
        })
      ),
    { dispatch: false }
  );
}
