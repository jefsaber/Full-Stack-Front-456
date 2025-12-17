import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { NotificationService } from '../../services/notification.service';
import { Action } from '@ngrx/store';

describe('AuthEffects', () => {
  let effects: AuthEffects;
  let actions$: Observable<Action>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  describe('login$', () => {
    it('should dispatch loginSuccess with valid credentials', (done) => {
      const action = AuthActions.login({ username: 'testuser', password: 'testpass' });

      actions$ = of(action);

      effects.login$.subscribe((result) => {
        expect(result.type).toBe('[Auth] Login Success');
        const successAction = result as ReturnType<typeof AuthActions.loginSuccess>;
        expect(successAction.access).toContain('mock-access-token');
        expect(successAction.refresh).toContain('mock-refresh-token');
        done();
      });
    });

    it('should dispatch loginFailure with empty username', (done) => {
      const action = AuthActions.login({ username: '', password: 'testpass' });

      actions$ = of(action);

      effects.login$.subscribe((result) => {
        expect(result.type).toBe('[Auth] Login Failure');
        const failureAction = result as ReturnType<typeof AuthActions.loginFailure>;
        expect(failureAction.error).toContain('Identifiants requis');
        done();
      });
    });

    it('should dispatch loginFailure with empty password', (done) => {
      const action = AuthActions.login({ username: 'testuser', password: '' });

      actions$ = of(action);

      effects.login$.subscribe((result) => {
        expect(result.type).toBe('[Auth] Login Failure');
        const failureAction = result as ReturnType<typeof AuthActions.loginFailure>;
        expect(failureAction.error).toContain('Identifiants requis');
        done();
      });
    });

    it('should dispatch loginFailure with "invalid" username', (done) => {
      const action = AuthActions.login({ username: 'invalid', password: 'testpass' });

      actions$ = of(action);

      effects.login$.subscribe((result) => {
        expect(result.type).toBe('[Auth] Login Failure');
        const failureAction = result as ReturnType<typeof AuthActions.loginFailure>;
        expect(failureAction.error).toContain('Identifiants incorrects');
        done();
      });
    });

    it('should dispatch loginFailure with "wrong" password', (done) => {
      const action = AuthActions.login({ username: 'testuser', password: 'wrong' });

      actions$ = of(action);

      effects.login$.subscribe((result) => {
        expect(result.type).toBe('[Auth] Login Failure');
        const failureAction = result as ReturnType<typeof AuthActions.loginFailure>;
        expect(failureAction.error).toContain('Identifiants incorrects');
        done();
      });
    });
  });

  describe('loginFailure$', () => {
    it('should call notification service on login failure', (done) => {
      const errorMessage = 'Invalid credentials';
      const action = AuthActions.loginFailure({ error: errorMessage });

      actions$ = of(action);

      effects.loginFailure$.subscribe(() => {
        expect(mockNotificationService.error).toHaveBeenCalledWith(errorMessage);
        done();
      });
    });
  });

  describe('loginSuccess$', () => {
    it('should call notification service on login success', (done) => {
      const action = AuthActions.loginSuccess({
        access: 'token',
        refresh: 'refresh',
      });

      actions$ = of(action);

      effects.loginSuccess$.subscribe(() => {
        expect(mockNotificationService.success).toHaveBeenCalledWith('Connexion réussie !');
        done();
      });
    });
  });

  describe('refreshToken$', () => {
    it('should dispatch refreshTokenSuccess with valid refresh token', (done) => {
      const action = AuthActions.refreshToken({ refreshToken: 'valid-refresh-token' });

      actions$ = of(action);

      effects.refreshToken$.subscribe((result) => {
        expect(result.type).toBe('[Auth] Refresh Token Success');
        const successAction = result as ReturnType<typeof AuthActions.refreshTokenSuccess>;
        expect(successAction.access).toContain('mock-access-token-refreshed');
        done();
      });
    });

    it('should dispatch refreshTokenFailure with expired token', (done) => {
      const action = AuthActions.refreshToken({ refreshToken: 'expired-token' });

      actions$ = of(action);

      effects.refreshToken$.subscribe((result) => {
        expect(result.type).toBe('[Auth] Refresh Token Failure');
        const failureAction = result as ReturnType<typeof AuthActions.refreshTokenFailure>;
        expect(failureAction.error).toContain('expired');
        done();
      });
    });

    it('should dispatch refreshTokenFailure with empty token', (done) => {
      const action = AuthActions.refreshToken({ refreshToken: '' });

      actions$ = of(action);

      effects.refreshToken$.subscribe((result) => {
        expect(result.type).toBe('[Auth] Refresh Token Failure');
        done();
      });
    });
  });

  describe('refreshTokenFailure$', () => {
    it('should call notification service on refresh token failure', (done) => {
      const action = AuthActions.refreshTokenFailure({ error: 'Token expired' });

      actions$ = of(action);

      effects.refreshTokenFailure$.subscribe(() => {
        expect(mockNotificationService.error).toHaveBeenCalledWith(
          'Session expirée. Veuillez vous reconnecter.'
        );
        done();
      });
    });
  });
});
