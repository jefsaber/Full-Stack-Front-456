import { createAction, props } from '@ngrx/store';

export interface TopProductStats {
  productId: string;
  name: string;
  sold: number;
  revenue: number;
}

export interface RecentOrderPreview {
  id: string;
  user: string;
  total: number;
  createdAt: string;
  status: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  topProducts: TopProductStats[];
  recentOrders: RecentOrderPreview[];
}

export const loadAdminDashboard = createAction('[Admin] Load Dashboard');

export const loadAdminDashboardSuccess = createAction(
  '[Admin] Load Dashboard Success',
  props<{ stats: AdminDashboardStats }>(),
);

export const loadAdminDashboardFailure = createAction(
  '[Admin] Load Dashboard Failure',
  props<{ error: string }>(),
);
