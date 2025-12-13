import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.reducer';

const selectAdminFeature = createFeatureSelector<AdminState>('admin');

export const selectAdminStats = createSelector(selectAdminFeature, (state) => state.stats);
export const selectAdminLoading = createSelector(selectAdminFeature, (state) => state.loading);
export const selectAdminError = createSelector(selectAdminFeature, (state) => state.error);
