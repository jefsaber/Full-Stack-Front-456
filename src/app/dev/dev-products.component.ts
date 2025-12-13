import { Component, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  imageUrl?: string;
}
interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Component({
  standalone: true,
  selector: 'app-dev-products',
  imports: [CommonModule, JsonPipe, FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <!-- Navbar -->
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">📦</span>
            </div>
            <h1 class="text-2xl font-bold text-white">Products Endpoint</h1>
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

      <!-- Main Content -->
      <div class="mx-auto max-w-4xl px-6 py-16">
        <div class="mb-12">
          <h2 class="text-5xl font-bold text-white mb-4">GET /api/products/</h2>
          <p class="text-xl text-purple-200">Test products endpoint with filters</p>
        </div>

        <!-- Filter Form -->
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8">
          <form
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            (submit)="$event.preventDefault(); load()"
          >
            <div class="bg-white/10 rounded-lg border border-white/20 px-3 py-2">
              <label class="text-xs text-gray-300 block mb-1">Page</label>
              <input type="number" [(ngModel)]="page" name="page" class="w-full bg-transparent text-white outline-none" />
            </div>

            <div class="bg-white/10 rounded-lg border border-white/20 px-3 py-2">
              <label class="text-xs text-gray-300 block mb-1">Page Size</label>
              <input type="number" [(ngModel)]="pageSize" name="pageSize" class="w-full bg-transparent text-white outline-none" />
            </div>

            <div class="bg-white/10 rounded-lg border border-white/20 px-3 py-2">
              <label class="text-xs text-gray-300 block mb-1">Min Rating</label>
              <input type="number" step="0.1" [(ngModel)]="minRating" name="minRating" class="w-full bg-transparent text-white outline-none" />
            </div>

            <div class="bg-white/10 rounded-lg border border-white/20 px-3 py-2">
              <label class="text-xs text-gray-300 block mb-1">Ordering</label>
              <input type="text" [(ngModel)]="ordering" name="ordering" placeholder="-created_at|price|name" class="w-full bg-transparent text-white outline-none text-sm" />
            </div>

            <button
              type="button"
              (click)="load()"
              class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition"
            >
              Fetch
            </button>
          </form>
        </div>

        <!-- Response Section -->
        @if (resp(); as r) {
          <div class="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6">
            <div class="mb-4 flex justify-between items-center">
              <h3 class="text-lg font-bold text-white">Response</h3>
              <div class="text-sm text-purple-200">Count: <span class="font-bold text-white">{{ r.count }}</span></div>
            </div>
            <pre class="rounded-lg bg-slate-950/50 p-4 text-sm text-green-300 overflow-x-auto">{{ r | json }}</pre>
          </div>
        }

        @if (err()) {
          <div class="rounded-2xl bg-red-500/20 border border-red-500/50 p-6">
            <p class="text-red-200 font-medium flex items-center gap-2">
              <span class="text-lg">⚠️</span>
              {{ err() }}
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-button {
      text-transform: none !important;
    }
  `]
})
export class DevProductsComponent {
  page = 1;
  pageSize = 10;
  minRating = 0;
  ordering = '-created_at';

  readonly resp = signal<Paginated<Product> | null>(null);
  readonly err = signal<string | null>(null);

  async load(): Promise<void> {
    this.err.set(null);
    this.resp.set(null);
    const q = new URLSearchParams({
      page: String(this.page),
      page_size: String(this.pageSize),
      min_rating: String(this.minRating),
      ordering: this.ordering,
    });
    const res = await fetch(`/api/products/?${q.toString()}`);
    if (!res.ok) {
      this.err.set(`${res.status} ${res.statusText}`);
      return;
    }
    const data = (await res.json()) as Paginated<Product>;
    this.resp.set(data);
  }
}
