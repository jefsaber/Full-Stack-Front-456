import { Component, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-dev-orders',
  imports: [CommonModule, JsonPipe, FormsModule, RouterLink, MatButtonModule, MatCardModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">🧾</span>
            </div>
            <h1 class="text-2xl font-bold text-white">Orders Endpoints</h1>
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

      <div class="mx-auto max-w-4xl px-6 py-16 space-y-10">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold text-white">GET /api/me/orders/</h2>
          <p class="text-sm text-gray-300">Returns the current user’s order history.</p>
          <button
            type="button"
            (click)="loadOrders()"
            class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-lg font-semibold transition"
          >
            Load Orders
          </button>
          <ng-container *ngIf="orders() as list; else emptyOrders">
            <pre class="rounded-2xl bg-slate-950/70 p-4 text-sm text-emerald-200 overflow-x-auto">{{ list | json }}</pre>
          </ng-container>
          <ng-template #emptyOrders>
            <p class="text-gray-400 text-sm">No orders loaded yet.</p>
          </ng-template>
        </div>

        <div class="space-y-2">
          <h2 class="text-3xl font-bold text-white">GET /api/orders/:id/</h2>
          <p class="text-sm text-gray-300">Inspect a single order’s detail payload.</p>
          <form class="flex gap-2" (submit)="$event.preventDefault(); loadOrderDetail()">
            <input
              type="number"
              [(ngModel)]="orderId"
              name="orderId"
              min="1"
              placeholder="Order ID"
              class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white"
            />
            <button
              type="submit"
              class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-5 rounded-lg font-semibold transition"
            >
              Fetch Detail
            </button>
          </form>
          <ng-container *ngIf="orderDetail() as detail">
            <pre class="rounded-2xl bg-slate-950/70 p-4 text-sm text-emerald-200 overflow-x-auto">{{ detail | json }}</pre>
          </ng-container>
        </div>

        <ng-container *ngIf="error()">
          <div class="rounded-2xl bg-red-500/20 border border-red-500/50 p-4 text-sm text-red-200">
            {{ error() }}
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `:host ::ng-deep .mat-mdc-button { text-transform: none !important; }`
  ]
})
export class DevOrdersComponent {
  orderId = 1;
  readonly orders = signal<any[] | null>(null);
  readonly orderDetail = signal<any | null>(null);
  readonly error = signal<string | null>(null);

  async loadOrders(): Promise<void> {
    this.error.set(null);
    this.orders.set(null);
    const res = await fetch('/api/me/orders/');
    if (!res.ok) {
      this.error.set(`${res.status} ${res.statusText}`);
      return;
    }
    this.orders.set(await res.json());
  }

  async loadOrderDetail(): Promise<void> {
    if (!this.orderId) {
      this.error.set('Select an order ID.');
      return;
    }
    this.error.set(null);
    this.orderDetail.set(null);
    const res = await fetch(`/api/orders/${this.orderId}/`);
    if (!res.ok) {
      this.error.set(`${res.status} ${res.statusText}`);
      return;
    }
    this.orderDetail.set(await res.json());
  }
}
