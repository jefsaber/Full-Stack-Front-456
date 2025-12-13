import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { products } from '../../mocks/data';

interface ValidationSummary {
  product_id: number;
  requested: number;
  available: number;
}

@Component({
  standalone: true,
  selector: 'app-dev-cart',
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">🧺</span>
            </div>
            <h1 class="text-2xl font-bold text-white">Cart Validation Endpoint</h1>
          </div>
          <button type="button" mat-button routerLink="/dev" class="text-gray-200 hover:text-white transition">
            ← Back to Dev
          </button>
        </div>
      </nav>

      <div class="mx-auto max-w-3xl px-6 py-16 space-y-10">
        <div>
          <h2 class="text-4xl font-bold text-white">POST /api/cart/validate-stock/</h2>
          <p class="text-sm text-gray-300">Simule la validation des quantités avant d'ajouter au panier.</p>
        </div>

        <form class="space-y-4" (submit)="$event.preventDefault(); validateStock()">
          <div class="grid grid-cols-2 gap-4">
            <label class="flex flex-col gap-1 text-sm text-gray-300">
              Produit
              <select
                [(ngModel)]="productId"
                name="productId"
                class="bg-slate-950/60 border border-white/10 rounded-lg px-3 py-2 text-white"
              >
                <option *ngFor="let item of availableProducts" [ngValue]="item.id">
                  {{ item.name }}
                </option>
              </select>
            </label>
            <label class="flex flex-col gap-1 text-sm text-gray-300">
              Quantity
              <input type="number" min="1" [(ngModel)]="quantity" name="quantity" class="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white" />
            </label>
          </div>
          <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition">
            Validate Stock
          </button>
        </form>

        <div *ngIf="error()" class="rounded-2xl bg-red-500/20 border border-red-500/50 p-4 text-sm text-red-200">
          {{ error() }}
        </div>

        <div *ngIf="response() as resp" class="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">Status</span>
            <span class="text-sm text-emerald-200">{{ resp.valid ? 'Validated' : 'Invalid' }}</span>
          </div>
          <p class="text-sm text-gray-300">{{ resp.message }}</p>
          <div *ngIf="resp.summary.length">
            <h3 class="text-sm uppercase tracking-[0.2em] text-purple-200">Summary</h3>
            <div class="grid gap-2 text-sm text-white">
              <div *ngFor="let item of resp.summary" class="rounded-lg bg-slate-950/60 p-3 border border-white/10">
                <p>{{ productName(item.product_id) }}</p>
                <p class="text-xs text-gray-300">Requested: {{ item.requested }}, Available: {{ item.available }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DevCartComponent {
  readonly availableProducts = products;
  productId = this.availableProducts[0]?.id ?? 1;
  quantity = 1;

  readonly response = signal<{ valid: boolean; message: string; summary: ValidationSummary[] } | null>(null);
  readonly error = signal<string | null>(null);

  productName(productId: number) {
    return this.availableProducts.find((product) => product.id === productId)?.name ?? `Product #${productId}`;
  }

  async validateStock(): Promise<void> {
    this.error.set(null);
    this.response.set(null);
    const res = await fetch('/api/cart/validate-stock/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ productId: this.productId, quantity: this.quantity }] }),
    });
    if (!res.ok) {
      const message = (await res.json()).detail ?? `${res.status} ${res.statusText}`;
      this.error.set(message);
      return;
    }
    this.response.set(await res.json());
  }
}
