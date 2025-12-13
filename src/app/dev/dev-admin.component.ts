import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminDashboardStats } from '../state/admin/admin.actions';

@Component({
  standalone: true,
  selector: 'app-dev-admin',
  imports: [CommonModule, RouterLink, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p class="text-xs uppercase tracking-[0.5em] text-purple-200">Dev / Admin</p>
            <h1 class="text-2xl font-bold text-white">Admin Stats Endpoint</h1>
          </div>
          <button
            type="button"
            mat-button
            routerLink="/dev"
            class="text-gray-200 hover:text-white transition"
          >
            ← Back to Dev
          </button>
        </div>
      </nav>

      <main class="mx-auto max-w-5xl px-6 py-16 space-y-8">
        <section class="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 space-y-4">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-sm text-gray-400">5.2 - GET /api/admin/stats/</p>
              <h2 class="text-3xl font-semibold text-white">Mocked admin dashboard payload</h2>
              <p class="text-sm text-gray-300 mt-1">Call this endpoint to retrieve totals, top products and recent orders.</p>
            </div>
            <button
              type="button"
              mat-raised-button
              color="primary"
              (click)="loadStats()"
              class="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
              [disabled]="loading()"
            >
              <mat-progress-spinner
                *ngIf="loading()"
                diameter="18"
                mode="indeterminate"
                class="text-white"
              ></mat-progress-spinner>
              <span>
                {{ loading() ? 'Chargement...' : 'Charger les stats' }}
              </span>
            </button>
          </div>

          <div *ngIf="stats() as payload; else emptyState" class="space-y-6">
            <div class="grid gap-4 md:grid-cols-3">
              <article class="rounded-2xl bg-purple-500/30 p-5 text-center">
                <p class="text-xs uppercase tracking-[0.3em] text-gray-200">Utilisateurs</p>
                <p class="text-3xl font-semibold text-white">{{ payload.totalUsers | number }}</p>
                <p class="text-xs text-gray-200">Comptes créés</p>
              </article>
              <article class="rounded-2xl bg-emerald-500/30 p-5 text-center">
                <p class="text-xs uppercase tracking-[0.3em] text-gray-200">Commandes</p>
                <p class="text-3xl font-semibold text-white">{{ payload.totalOrders | number }}</p>
                <p class="text-xs text-gray-200">Total processing</p>
              </article>
              <article class="rounded-2xl bg-cyan-500/30 p-5 text-center">
                <p class="text-xs uppercase tracking-[0.3em] text-gray-200">CA brut</p>
                <p class="text-3xl font-semibold text-white">{{ payload.totalRevenue | number:'1.0-0' }} €</p>
                <p class="text-xs text-gray-200">Revenus</p>
              </article>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-white">Top produits</h3>
                <p class="text-sm text-purple-300">{{ payload.topProducts.length }} produits</p>
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <article
                  *ngFor="let product of payload.topProducts"
                  class="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div class="flex items-center justify-between">
                    <p class="text-lg font-semibold text-white">{{ product.name }}</p>
                    <span class="text-xs uppercase tracking-[0.3em] text-gray-400">{{ product.productId }}</span>
                  </div>
                  <p class="text-sm text-gray-300 mt-3">{{ product.sold | number }} vendus • {{ product.revenue | number:'1.0-0' }} €</p>
                </article>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-white">Commandes récentes</h3>
                <p class="text-sm text-purple-300">{{ payload.recentOrders.length }} dernières</p>
              </div>
              <div class="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/50">
                <table class="min-w-full text-sm text-left">
                  <thead class="text-xs uppercase tracking-[0.3em] text-gray-400">
                    <tr>
                      <th class="px-4 py-3">ID</th>
                      <th class="px-4 py-3">Utilisateur</th>
                      <th class="px-4 py-3">Montant</th>
                      <th class="px-4 py-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let order of payload.recentOrders" class="border-t border-white/5">
                      <td class="px-4 py-3 font-mono text-slate-200">{{ order.id }}</td>
                      <td class="px-4 py-3 text-gray-200">{{ order.user }}</td>
                      <td class="px-4 py-3 text-emerald-200">{{ order.total | number:'1.0-0' }} €</td>
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
              </div>
            </div>

            <div class="rounded-2xl bg-slate-950/50 p-4 text-xs text-gray-300">
              <p class="font-semibold text-white">Payload brut</p>
              <pre class="mt-2 max-h-64 overflow-auto text-[10px] leading-snug text-emerald-200">{{ payload | json }}</pre>
            </div>
          </div>

          <ng-template #emptyState>
            <div class="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-gray-300">
              <p>Appuie sur « Charger les stats » pour voir le résultat MSW.</p>
            </div>
          </ng-template>

          <div *ngIf="error()" class="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            {{ error() }}
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [
    `:host ::ng-deep .mat-mdc-button { text-transform: none !important; }`
  ]
})
export class DevAdminComponent {
  readonly stats = signal<AdminDashboardStats | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async loadStats(): Promise<void> {
    this.error.set(null);
    this.loading.set(true);
    this.stats.set(null);
    try {
      const response = await fetch('/api/admin/stats/');
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      this.stats.set((await response.json()) as AdminDashboardStats);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Impossible de charger les stats');
    } finally {
      this.loading.set(false);
    }
  }
}
