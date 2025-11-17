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
  ],
  template: `
    <div class="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6">
      <div class="mx-auto max-w-2xl">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-4xl font-bold text-slate-900 mb-2">Product Ratings</h1>
            <p class="text-slate-600">Check ratings by product ID</p>
          </div>
          <button 
            type="button"
            routerLink="/app"
            mat-raised-button
            class="bg-slate-900 text-white hover:bg-slate-800"
          >
            ← Back
          </button>
        </div>

        <!-- Search Form Card -->
        <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span class="text-2xl">🔍</span> Find Product Rating
          </h2>
          <form [formGroup]="searchForm" (ngSubmit)="searchRating()" class="space-y-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Product ID (1-20)</mat-label>
              <input 
                matInput 
                type="number" 
                min="1" 
                formControlName="productId"
                placeholder="Enter product ID"
              />
            </mat-form-field>

            <button 
              type="submit"
              mat-raised-button 
              color="primary"
              [disabled]="searchForm.invalid || (loading$ | async)"
              class="w-full bg-purple-600 text-white hover:bg-purple-700 py-3 text-lg font-semibold"
            >
              @if (loading$ | async) {
                Loading...
              } @else {
                Get Rating
              }
            </button>
          </form>
        </div>

        <!-- Error State -->
        @if (error$ | async; as error) {
          <div class="bg-red-50 border border-red-500/50 rounded-2xl p-6 mb-8">
            <p class="text-red-600 font-medium flex items-center gap-2">
              <span class="text-2xl">⚠️</span>
              {{ error }}
            </p>
          </div>
        }

        <!-- Rating Result -->
        @if (rating$ | async; as rating) {
          @if (rating) {
            <div class="space-y-6">
              <!-- Result Header -->
              <div class="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8">
                <h3 class="text-2xl font-bold text-slate-900 mb-2">Product #{{ rating['product_id'] }}</h3>
                <p class="text-slate-600">Rating Summary</p>
              </div>

              <!-- Rating Display -->
              <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div class="mb-4">
                  <div class="text-8xl font-bold text-yellow-500 mb-2">
                    {{ rating['avg_rating'] }}
                  </div>
                  <div class="flex justify-center gap-1 text-4xl">
                    @for (star of [1,2,3,4,5]; track star) {
                      <span [class]="star <= rating['avg_rating'] ? 'text-yellow-500' : 'text-slate-300'">
                        ★
                      </span>
                    }
                  </div>
                </div>
                <div class="mt-8 pt-8 border-t border-slate-200">
                  <p class="text-slate-600 text-lg">
                    Based on <span class="font-bold text-slate-900 text-2xl">{{ rating['count'] }}</span> reviews
                  </p>
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
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
