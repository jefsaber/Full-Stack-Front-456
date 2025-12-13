import { createReducer, on } from '@ngrx/store';
import * as AdminActions from './admin.actions';
import { AdminDashboardStats } from './admin.actions';

export interface AdminState {
  stats: AdminDashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  loading: false,
  error: null,
};

export const adminReducer = createReducer(
  initialState,
  on(AdminActions.loadAdminDashboard, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AdminActions.loadAdminDashboardSuccess, (state, { stats }) => ({
    ...state,
    stats,
    loading: false,
    error: null,
  })),
  on(AdminActions.loadAdminDashboardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
