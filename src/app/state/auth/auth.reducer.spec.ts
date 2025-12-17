import { authReducer, AuthState } from './auth.reducer';
import * as AuthActions from './auth.actions';

describe('AuthReducer', () => {
  const initialState: AuthState = {
    access: null,
    refresh: null,
    loading: false,
    error: null,
  };

  describe('login', () => {
    it('should set loading to true and clear error on login', () => {
      const action = AuthActions.login({ username: 'test', password: 'test' });
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('loginSuccess', () => {
    it('should store access and refresh tokens', () => {
      const tokens = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      };

      const action = AuthActions.loginSuccess(tokens);
      const state = authReducer(initialState, action);

      expect(state.access).toBe('mock-access-token');
      expect(state.refresh).toBe('mock-refresh-token');
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should clear loading state after success', () => {
      const loadingState: AuthState = {
        ...initialState,
        loading: true,
      };

      const action = AuthActions.loginSuccess({
        access: 'token',
        refresh: 'refresh',
      });
      const state = authReducer(loadingState, action);

      expect(state.loading).toBe(false);
    });

    it('should clear previous error on success', () => {
      const errorState: AuthState = {
        ...initialState,
        error: 'Previous error',
      };

      const action = AuthActions.loginSuccess({
        access: 'token',
        refresh: 'refresh',
      });
      const state = authReducer(errorState, action);

      expect(state.error).toBeNull();
    });
  });

  describe('loginFailure', () => {
    it('should store error message', () => {
      const errorMessage = 'Invalid credentials';
      const action = AuthActions.loginFailure({ error: errorMessage });
      const state = authReducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
    });

    it('should clear loading state on failure', () => {
      const loadingState: AuthState = {
        ...initialState,
        loading: true,
      };

      const action = AuthActions.loginFailure({ error: 'Error' });
      const state = authReducer(loadingState, action);

      expect(state.loading).toBe(false);
    });

    it('should not clear tokens on failure', () => {
      const stateWithTokens: AuthState = {
        ...initialState,
        access: 'existing-token',
        refresh: 'existing-refresh',
        loading: true,
      };

      const action = AuthActions.loginFailure({ error: 'Error' });
      const state = authReducer(stateWithTokens, action);

      // Tokens should remain (failure doesn't clear existing session)
      expect(state.access).toBe('existing-token');
      expect(state.refresh).toBe('existing-refresh');
    });
  });

  describe('logout', () => {
    it('should clear tokens on logout', () => {
      const authenticatedState: AuthState = {
        access: 'token',
        refresh: 'refresh',
        loading: false,
        error: null,
      };

      const action = AuthActions.logout();
      const state = authReducer(authenticatedState, action);

      expect(state.access).toBeNull();
      expect(state.refresh).toBeNull();
    });

    it('should clear error on logout', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Some error',
      };

      const action = AuthActions.logout();
      const state = authReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('refreshTokenSuccess', () => {
    it('should update access token', () => {
      const stateWithTokens: AuthState = {
        access: 'old-token',
        refresh: 'refresh-token',
        loading: true,
        error: null,
      };

      const action = AuthActions.refreshTokenSuccess({ access: 'new-access-token' });
      const state = authReducer(stateWithTokens, action);

      expect(state.access).toBe('new-access-token');
      expect(state.refresh).toBe('refresh-token'); // refresh token unchanged
      expect(state.loading).toBe(false);
    });
  });

  describe('refreshTokenFailure', () => {
    it('should store error and stop loading', () => {
      const loadingState: AuthState = {
        ...initialState,
        loading: true,
      };

      const action = AuthActions.refreshTokenFailure({ error: 'Token expired' });
      const state = authReducer(loadingState, action);

      expect(state.error).toBe('Token expired');
      expect(state.loading).toBe(false);
    });
  });
});
