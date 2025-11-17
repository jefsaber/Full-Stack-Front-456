import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from './state/auth/auth.selectors';
import * as AuthActions from './state/auth/auth.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule],
  template: `
    <section class="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <!-- Header with Auth Status -->
      <div class="flex justify-between items-start">
        <div class="text-left">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">My Shop</h1>
          <p class="text-xl text-gray-600">Welcome to your shopping experience</p>
        </div>

        <!-- Mini Dashboard / Auth Status -->
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 min-w-max">
          @if (isAuthenticated$ | async) {
            <div class="text-green-700 font-medium text-sm">
              ✓ Authenticated
            </div>
            <button
              type="button"
              mat-stroked-button
              (click)="logout()"
              class="mt-2 w-full text-xs"
            >
              Logout
            </button>
          } @else {
            <div class="text-gray-700 font-medium text-sm">
              Not signed in
            </div>
            <button
              type="button"
              mat-stroked-button
              routerLink="/login"
              class="mt-2 w-full text-xs"
            >
              Sign In
            </button>
          }
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Login Feature -->
        <div class="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-semibold text-gray-900 mb-3">🔐 Sign In</h3>
          <p class="text-gray-600 mb-4">Access your account with demo credentials (demo/demo)</p>
          <button
            type="button"
            routerLink="/login"
            mat-raised-button
            color="primary"
            class="w-full"
          >
            Go to Login
          </button>
        </div>

        <!-- Products Feature -->
        <div class="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-semibold text-gray-900 mb-3">🛍️ Shop Products</h3>
          <p class="text-gray-600 mb-4">Browse our collection with filters and sorting</p>
          <button
            type="button"
            routerLink="/shop/products"
            mat-raised-button
            color="accent"
            class="w-full"
          >
            View Products
          </button>
        </div>

        <!-- Ratings Feature -->
        <div class="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-semibold text-gray-900 mb-3">⭐ Check Ratings</h3>
          <p class="text-gray-600 mb-4">See detailed ratings for any product by ID</p>
          <button
            type="button"
            routerLink="/shop/rating"
            mat-raised-button
            color="warn"
            class="w-full"
          >
            View Ratings
          </button>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex gap-3 justify-center pt-6 border-t border-gray-200 flex-wrap">
        <button
          type="button"
          routerLink="/dev"
          mat-stroked-button
          size="small"
        >
          Dev Pages
        </button>
        <button
          type="button"
          routerLink="/"
          mat-stroked-button
          size="small"
        >
          Home
        </button>
      </div>
    </section>
  `,
})
export class AppPlaceholderComponent {
  isAuthenticated$: any;

  constructor(private store: Store) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
