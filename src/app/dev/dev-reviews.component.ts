import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Review } from '../state/reviews/review.model';
import { products } from '../../mocks/data';

@Component({
  standalone: true,
  selector: 'app-dev-reviews',
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">⭐</span>
            </div>
            <h1 class="text-2xl font-bold text-white">Reviews Endpoint</h1>
          </div>
          <button type="button" mat-button routerLink="/dev" class="text-gray-200 hover:text-white transition">
            ← Back to Dev
          </button>
        </div>
      </nav>

      <div class="mx-auto max-w-4xl px-6 py-16 space-y-10">
        <div>
          <h2 class="text-4xl font-bold text-white">GET /api/products/:id/reviews/</h2>
          <p class="text-sm text-gray-300">Récupère les avis filtrés et triés.</p>
        </div>

        <form class="grid grid-cols-1 md:grid-cols-3 gap-4" (submit)="$event.preventDefault(); loadReviews()">
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
            Min Rating
            <input type="number" min="0" max="5" step="0.1" [(ngModel)]="minRating" name="minRating" class="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white" />
          </label>
          <label class="flex flex-col gap-1 text-sm text-gray-300">
            Sort By
            <select [(ngModel)]="sortBy" name="sortBy" class="bg-slate-950/60 border border-white/10 rounded-lg px-3 py-2 text-white">
              <option value="recent">Recent</option>
              <option value="rating">Rating</option>
            </select>
          </label>
          <button type="submit" class="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
            Load Reviews
          </button>
        </form>

        <div *ngIf="reviews() as list" class="space-y-4">
          <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p class="text-sm text-gray-300">{{ stats()?.count ?? 0 }} avis • Moyenne {{ stats()?.average ?? 0 | number:'1.1-1' }}</p>
          </div>
          <div class="space-y-3">
            <div *ngFor="let review of list" class="rounded-2xl bg-slate-950/70 border border-white/10 p-4 space-y-2">
              <div class="flex items-center justify-between">
                <p class="text-white font-semibold">{{ review.author }}</p>
                <p class="text-sm text-amber-300">{{ review.rating }}★</p>
              </div>
              <p class="text-sm text-gray-300">{{ review.comment }}</p>
              <p class="text-xs text-gray-500">{{ review.createdAt }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h3 class="text-lg font-bold text-white">POST /api/products/:id/reviews/</h3>
          <form class="space-y-3" (submit)="$event.preventDefault(); submitReview()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Author" [(ngModel)]="author" name="author" class="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white" />
              <input type="number" placeholder="Rating" min="1" max="5" [(ngModel)]="rating" name="rating" class="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white" />
            </div>
            <textarea
              placeholder="Comment"
              [(ngModel)]="comment"
              name="comment"
              rows="3"
              class="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
            ></textarea>
            <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition">
              Submit Review
            </button>
          </form>
          <div *ngIf="reviewResponse()" class="rounded-lg bg-slate-950/60 border border-white/10 p-3 text-sm text-emerald-200">
            {{ reviewResponse() | json }}
          </div>
          <div *ngIf="reviewError()" class="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-200">
            {{ reviewError() }}
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DevReviewsComponent {
  readonly availableProducts = products;
  productId = this.availableProducts[0]?.id ?? 1;
  minRating = 0;
  sortBy: 'recent' | 'rating' = 'recent';

  author = '';
  rating = 5;
  comment = '';

  private statsSignal = signal<{ average: number; count: number } | null>(null);
  readonly reviews = signal<Review[] | null>(null);
  readonly reviewResponse = signal<Record<string, unknown> | null>(null);
  readonly reviewError = signal<string | null>(null);

  stats() {
    return this.statsSignal();
  }

  async loadReviews(): Promise<void> {
    this.reviewError.set(null);
    this.reviewResponse.set(null);
    const query = new URLSearchParams({
      min_rating: String(this.minRating),
      sort_by: this.sortBy,
    });
    const res = await fetch(`/api/products/${this.productId}/reviews/?${query.toString()}`);
    if (!res.ok) {
      this.reviewError.set(`${res.status} ${res.statusText}`);
      return;
    }
    const json = await res.json();
    this.reviews.set(json.results);
    this.statsSignal.set({ average: json.average, count: json.count });
  }

  async submitReview(): Promise<void> {
    this.reviewError.set(null);
    this.reviewResponse.set(null);
    const payload = {
      author: this.author,
      rating: this.rating,
      comment: this.comment,
    };
    const res = await fetch(`/api/products/${this.productId}/reviews/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      this.reviewError.set(data.detail || `${res.status} ${res.statusText}`);
      return;
    }
    this.reviewResponse.set(data);
    await this.loadReviews();
  }
}
