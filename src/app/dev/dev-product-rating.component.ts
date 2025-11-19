import { CommonModule, JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface RatingResponse {
  product_id: number;
  avg_rating: number;
  count: number;
}

@Component({
  standalone: true,
  selector: 'app-dev-product-rating',
  imports: [CommonModule, FormsModule, RouterLink, JsonPipe, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <!-- Navbar -->
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">⭐</span>
            </div>
            <h1 class="text-2xl font-bold text-white">Product Rating Endpoint</h1>
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
      <div class="mx-auto max-w-2xl px-6 py-16">
        <div class="mb-12">
          <h2 class="text-5xl font-bold text-white mb-4">GET /api/products/:id/rating/</h2>
          <p class="text-xl text-purple-200">Fetch rating for a specific product</p>
        </div>

        <!-- Filter Form -->
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8">
          <form class="flex items-end gap-4" (submit)="$event.preventDefault(); load()">
            <div class="bg-white/10 rounded-lg border border-white/20 px-3 py-2 flex-1">
              <label class="text-xs text-gray-300 block mb-1">Product ID (1-20)</label>
              <input type="number" min="1" max="20" [(ngModel)]="id" name="id" class="w-full bg-transparent text-white outline-none" />
            </div>

            <button
              type="button"
              (click)="load()"
              class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition"
            >
              Fetch Rating
            </button>
          </form>
        </div>

        <!-- Response Section -->
        @if (resp(); as r) {
          <div class="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6">
            <h3 class="text-lg font-bold text-white mb-4">Response</h3>
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
export class DevProductRatingComponent {
  id = 1;
  readonly resp = signal<RatingResponse | null>(null);
  readonly err = signal<string | null>(null);

  async load(): Promise<void> {
    this.err.set(null);
    this.resp.set(null);
    const res = await fetch(`/api/products/${this.id}/rating/`);
    if (!res.ok) {
      this.err.set(`${res.status} ${res.statusText}`);
      return;
    }
    const data = (await res.json()) as RatingResponse;
    this.resp.set(data);
  }
}
