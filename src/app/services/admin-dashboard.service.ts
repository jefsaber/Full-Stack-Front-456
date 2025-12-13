import { Injectable } from '@angular/core';
import { delay, of, Observable } from 'rxjs';
import { AdminDashboardStats } from '../state/admin/admin.actions';

export const MOCK_ADMIN_STATS: AdminDashboardStats = {
  totalUsers: 1284,
  totalOrders: 402,
  totalRevenue: 176540,
  topProducts: [
    { productId: 'P-1001', name: 'Pochette Plastique', sold: 182, revenue: 5460 },
    { productId: 'P-1002', name: 'Classeur Rouge', sold: 134, revenue: 6030 },
    { productId: 'P-1003', name: 'Feuilles A4', sold: 117, revenue: 4680 },
    { productId: 'P-1004', name: 'Stylo Bleu', sold: 96, revenue: 2400 },
  ],
  recentOrders: [
    { id: '1009', user: 'Jules Fournier', total: 68.4, createdAt: '2025-12-12T17:50:00Z', status: 'en_cours' },
    { id: '1008', user: 'Alix Beaufort', total: 102.3, createdAt: '2025-12-12T15:30:00Z', status: 'expediee' },
    { id: '1007', user: 'Nadia Sanchez', total: 39.9, createdAt: '2025-12-12T14:10:00Z', status: 'livree' },
    { id: '1006', user: 'Souleymane Diallo', total: 145.0, createdAt: '2025-12-12T12:55:00Z', status: 'expediee' },
    { id: '1005', user: 'Camille Rossi', total: 214.2, createdAt: '2025-12-12T11:10:00Z', status: 'en_cours' },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  fetchDashboard(): Observable<AdminDashboardStats> {
    return of(MOCK_ADMIN_STATS).pipe(delay(400));
  }
}
