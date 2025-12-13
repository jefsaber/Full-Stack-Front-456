import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AdminSelectors from '../state/admin/admin.selectors';
import * as AdminActions from '../state/admin/admin.actions';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav class="backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-50">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p class="text-xs uppercase tracking-[0.5em] text-purple-200">Admin</p>
            <h1 class="text-3xl font-bold text-white">Dashboard</h1>
            <p class="text-sm text-gray-300 mt-1">Vue d'ensemble de l'activité commerciale</p>
          </div>
          <button
            type="button"
            routerLink="/app"
            class="rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
          >
            Back to Store
          </button>
        </div>
      </nav>

      <main class="mx-auto max-w-6xl px-6 py-12 space-y-8">
        <div *ngIf="loading$ | async" class="rounded-2xl bg-white/5 p-6 text-center text-sm text-gray-300">
          Chargement des statistiques…
        </div>
        <div *ngIf="error$ | async as error" class="rounded-2xl bg-red-500/20 border border-red-400/40 p-6 text-sm text-red-100">
          {{ error }}
        </div>

        <section *ngIf="stats$ | async as stats" class="space-y-6">
          <div class="grid gap-6 md:grid-cols-3">
            <div class="rounded-3xl bg-white/5 p-6 shadow-lg shadow-black/20">
              <p class="text-sm uppercase tracking-[0.3em] text-gray-400">Utilisateurs</p>
              <p class="text-3xl font-bold text-white">{{ stats.totalUsers | number }}</p>
              <p class="text-xs text-gray-400">Total inscrit</p>
            </div>
            <div class="rounded-3xl bg-white/5 p-6 shadow-lg shadow-black/20">
              <p class="text-sm uppercase tracking-[0.3em] text-gray-400">Commandes</p>
              <p class="text-3xl font-bold text-white">{{ stats.totalOrders | number }}</p>
              <p class="text-xs text-gray-400">Passées</p>
            </div>
            <div class="rounded-3xl bg-white/5 p-6 shadow-lg shadow-black/20">
              <p class="text-sm uppercase tracking-[0.3em] text-gray-400">Chiffre d'affaires</p>
              <p class="text-3xl font-bold text-white">{{ stats.totalRevenue | number:'1.0-0' }} €</p>
              <p class="text-xs text-gray-400">Somme brute</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold text-white">Top produits</h2>
              <p class="text-sm text-purple-200">{{ stats.topProducts.length }} produits</p>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div
                *ngFor="let product of stats.topProducts; trackBy: trackByTopProduct"
                class="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-black/20"
              >
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-white">{{ product.name }}</h3>
                  <span class="text-xs uppercase tracking-[0.3em] text-gray-400">{{ product.productId }}</span>
                </div>
                <div class="mt-4 flex items-center gap-4 text-sm text-gray-300">
                  <p>{{ product.sold | number }} vendus</p>
                  <p>{{ product.revenue | number:'1.0-0' }} €</p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold text-white">Commandes récentes</h2>
              <p class="text-sm text-purple-200">Dernières 5 commandes</p>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/5 shadow-lg shadow-black/20">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-white/10 text-sm text-left">
                  <thead class="text-xs uppercase tracking-[0.3em] text-gray-400">
                    <tr>
                      <th class="px-4 py-3">ID</th>
                      <th class="px-4 py-3">Client</th>
                      <th class="px-4 py-3">Montant</th>
                      <th class="px-4 py-3">Créée le</th>
                      <th class="px-4 py-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5" *ngIf="stats.recentOrders.length; else emptyOrders">
                    <tr *ngFor="let order of stats.recentOrders; trackBy: trackByRecentOrder" class="hover:bg-white/5">
                      <td class="px-4 py-3 font-mono text-slate-200">{{ order.id }}</td>
                      <td class="px-4 py-3 text-sm text-gray-200">{{ order.user }}</td>
                      <td class="px-4 py-3 text-sm text-emerald-200">{{ order.total | number:'1.0-0' }} €</td>
                      <td class="px-4 py-3 text-sm text-gray-300">{{ order.createdAt | date:'medium' }}</td>
                      <td class="px-4 py-3">
                        <span
                          class="rounded-full px-3 py-1 text-xs font-semibold"
                          [ngClass]="{
                            'bg-green-500/20 text-emerald-200': order.status === 'livree',
                            'bg-yellow-500/20 text-amber-200': order.status === 'en_cours',
                            'bg-blue-500/20 text-sky-200': order.status === 'expediee',
                          }"
                        >
                          {{ order.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <ng-template #emptyOrders>
                  <div class="p-6 text-center text-sm text-gray-400">Aucune commande récente</div>
                </ng-template>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
})
export class AdminDashboardComponent {
  private readonly store: Store;
  readonly stats$: Observable<AdminActions.AdminDashboardStats | null>;
  readonly loading$: Observable<boolean>;
  readonly error$: Observable<string | null>;

  constructor() {
    this.store = inject(Store);
    this.stats$ = this.store.select(AdminSelectors.selectAdminStats);
    this.loading$ = this.store.select(AdminSelectors.selectAdminLoading);
    this.error$ = this.store.select(AdminSelectors.selectAdminError);
    this.store.dispatch(AdminActions.loadAdminDashboard());
  }

  trackByTopProduct(_index: number, product: AdminActions.TopProductStats): string {
    return product.productId;
  }

  trackByRecentOrder(_index: number, order: AdminActions.RecentOrderPreview): string {
    return order.id;
  }
}
