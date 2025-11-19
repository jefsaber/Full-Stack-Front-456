import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import * as ProductsActions from '../state/products/products.actions';
import {
  selectRating,
  selectRatingLoading,
  selectRatingError,
} from '../state/products/products.selectors';
import { Observable } from 'rxjs';
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';

export interface ProductRating {
  product_id: number;
  avg_rating: number;
  count: number;
}

@Component({
  standalone: true,
  selector: 'app-product-rating-page',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SkeletonLoaderComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
      <!-- Background Gradient Blobs -->
      <div class="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-600/20 to-transparent rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-emerald-600/20 to-transparent rounded-full blur-3xl"></div>

      <div class="mx-auto max-w-2xl relative z-10">
        <!-- Sticky Header -->
        <div class="sticky top-0 z-20 mb-8 bg-slate-900/80 backdrop-blur-md border-b border-white/10 -mx-6 px-6 py-4 rounded-b-2xl">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-1">Product Ratings</h1>
              <p class="text-gray-400 text-sm">Search and discover product ratings</p>
            </div>
            <button 
              type="button"
              routerLink="/app"
              class="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition"
            >
              ← Back
            </button>
          </div>
        </div>

        <!-- Search Form Card -->
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span class="text-2xl">🔍</span> Find Product Rating
          </h2>
          <form [formGroup]="searchForm" (ngSubmit)="searchRating()" class="space-y-4">
            <div class="bg-white/10 rounded-lg border border-white/20 px-3 py-2">
              <label class="text-xs text-gray-300 block mb-1">Product ID (1-20)</label>
              <input 
                type="number" 
                min="1" 
                max="20"
                formControlName="productId"
                placeholder="Enter product ID"
                class="w-full bg-transparent text-white outline-none placeholder-gray-500"
              />
            </div>

            <button 
              type="submit"
              [disabled]="searchForm.invalid || (loading$ | async)"
              class="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition duration-300"
            >
              @if (loading$ | async) {
                <span class="inline-block mr-2">⏳</span> Loading...
              } @else {
                Get Rating
              }
            </button>
          </form>
        </div>

        <!-- Skeleton Loading State -->
        @if (loading$ | async) {
          <app-skeleton-loader 
            [count]="1"
            type="card">
          </app-skeleton-loader>
        }

        <!-- Error State -->
        @if ((error$ | async); as error) {
          <div class="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 mb-8">
            <p class="text-red-400 font-medium flex items-center gap-2">
              <span class="text-2xl">⚠️</span>
              {{ error }}
            </p>
          </div>
        }

        <!-- Rating Result (Optimistic UI) -->
        @if ((rating$ | async); as rating) {
          @if (rating) {
            <div class="space-y-6 animate-fadeIn">
              <!-- Result Header -->
              <div class="bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur">
                <h3 class="text-2xl font-bold text-white mb-2">Product #{{ rating['product_id'] }}</h3>
                <p class="text-gray-300">Rating Summary</p>
              </div>

              <!-- Rating Display -->
              <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center shadow-2xl">
                <div class="mb-4">
                  <div class="text-8xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                    {{ rating['avg_rating'] }}
                  </div>
                  <div class="flex justify-center gap-1 text-4xl">
                    @for (star of [1,2,3,4,5]; track star) {
                      <span [class]="star <= rating['avg_rating'] ? 'text-yellow-400' : 'text-white/20'">
                        ★
                      </span>
                    }
                  </div>
                </div>
                <div class="mt-8 pt-8 border-t border-white/10">
                  <p class="text-gray-300 text-lg">
                    Based on <span class="font-bold text-white text-2xl">{{ rating['count'] }}</span> reviews
                  </p>
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    ::ng-deep .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `],
})
export class ProductRatingPageComponent {
  searchForm: FormGroup;
  rating$: Observable<ProductRating | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.searchForm = this.fb.group({
      productId: ['', [Validators.required, Validators.min(1)]],
    });

    this.rating$ = this.store.select(selectRating);
    this.loading$ = this.store.select(selectRatingLoading);
    this.error$ = this.store.select(selectRatingError);
  }

  searchRating(): void {
    if (this.searchForm.invalid) return;

    const productId = this.searchForm.get('productId')?.value;
    this.store.dispatch(ProductsActions.loadRating({ productId }));
  }
}
