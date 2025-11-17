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
    <div class="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Product Rating</h1>
        <button 
          type="button"
          routerLink="/app"
          mat-stroked-button
        >
          ← Back
        </button>
      </div>

      <!-- Search Form -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Find Product Rating</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="searchForm" (ngSubmit)="searchRating()" class="space-y-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Product ID</mat-label>
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
              class="w-full"
            >
              @if (loading$ | async) {
                Loading...
              } @else {
                Get Rating
              }
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Error State -->
      @if (error$ | async; as error) {
        <mat-card class="border-2 border-red-200 bg-red-50">
          <mat-card-content>
            <p class="text-red-700 font-medium">{{ error }}</p>
          </mat-card-content>
        </mat-card>
      }

      <!-- Rating Result -->
      @if (rating$ | async; as rating) {
        @if (rating) {
          <mat-card class="border-2 border-indigo-200">
            <mat-card-header>
              <mat-card-title>Rating for Product #{{ rating['product_id'] }}</mat-card-title>
            </mat-card-header>
            <mat-card-content class="space-y-4">
              <div class="bg-indigo-50 p-6 rounded-lg text-center">
                <p class="text-6xl font-bold text-indigo-600 mb-2">
                  {{ rating['avg_rating'] }}<span class="text-4xl">★</span>
                </p>
                <p class="text-lg text-gray-600">
                  Based on <strong>{{ rating['count'] }}</strong> reviews
                </p>
              </div>
            </mat-card-content>
          </mat-card>
        }
      }
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
