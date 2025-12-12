import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from './state/auth/auth.selectors';
import * as AuthActions from './state/auth/auth.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { WishlistIconComponent } from './components/wishlist-icon/wishlist-icon.component';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, CartIconComponent, WishlistIconComponent],
  template: `
    <div class="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <!-- Navbar -->
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4">
          <div class="flex justify-between items-center">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">🛍️</span>
              </div>
              <h1 class="text-2xl font-bold text-white">My Shop</h1>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center gap-6">
              <button 
                type="button"
                mat-button
                routerLink="/"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Home
              </button>
              <button 
                type="button"
                mat-button
                routerLink="/shop/products"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Products
              </button>
              <button 
                type="button"
                mat-button
                routerLink="/shop/rating"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Ratings
              </button>
              <button 
                type="button"
                mat-button
                *ngIf="isAuthenticated$ | async"
                routerLink="/account/profile"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Mon Compte
              </button>
              <button 
                type="button"
                mat-button
                routerLink="/dev"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Dev
              </button>
            </div>
          
            <!-- Auth Section -->
            <div class="flex items-center gap-4">
              <!-- Cart Icon -->
              <app-cart-icon></app-cart-icon>
              <app-wishlist-icon></app-wishlist-icon>

              @if (isAuthenticated$ | async) {
                <div class="flex items-center gap-3 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span class="text-green-200 font-medium text-sm">Authenticated</span>
                </div>
                <button
                  type="button"
                  mat-button
                  (click)="logout()"
                  class="text-red-300 hover:text-red-100 transition"
                >
                  Logout
                </button>
              } @else {
                <button
                  type="button"
                  mat-raised-button
                  routerLink="/login"
                  class="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Sign In
                </button>
              }
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="mx-auto max-w-7xl px-6 py-16">
        <!-- Hero Section -->
        <div class="mb-16">
          <h2 class="text-5xl font-bold text-white mb-4">Welcome to My Shop</h2>
          <p class="text-xl text-purple-200">Discover our amazing collection and manage your account</p>
        </div>

        <!-- Feature Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <!-- Products Card -->
          <div class="group relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 p-8 hover:border-blue-400/80 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer" routerLink="/shop/products">
            <div class="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
            <div class="relative z-10">
              <div class="w-14 h-14 bg-blue-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/50 transition">
                <span class="text-2xl">📦</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Browse Products</h3>
              <p class="text-blue-200 mb-4">Explore our collection with advanced filters</p>
              <span class="inline-flex items-center text-blue-300 font-semibold group-hover:gap-2 transition-all gap-1">
                View Now <span class="text-xl">→</span>
              </span>
            </div>
          </div>

          <!-- Ratings Card -->
          <div class="group relative overflow-hidden rounded-2xl bg-linear-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/50 p-8 hover:border-pink-400/80 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer" routerLink="/shop/rating">
            <div class="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
            <div class="relative z-10">
              <div class="w-14 h-14 bg-pink-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-pink-500/50 transition">
                <span class="text-2xl">⭐</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Product Ratings</h3>
              <p class="text-pink-200 mb-4">Check ratings and reviews on any product</p>
              <span class="inline-flex items-center text-pink-300 font-semibold group-hover:gap-2 transition-all gap-1">
                View Now <span class="text-xl">→</span>
              </span>
            </div>
          </div>

          <!-- Account Card -->
          <div class="group relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/50 p-8 hover:border-purple-400/80 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300" [routerLink]="(isAuthenticated$ | async) ? '/account/profile' : null">
            <div class="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
            <div class="relative z-10">
              <div class="w-14 h-14 bg-purple-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/50 transition">
                <span class="text-2xl">🔐</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Your Account</h3>
              @if (isAuthenticated$ | async) {
                <p class="text-purple-200 mb-4">View your profile and order history</p>
              } @else {
                <p class="text-purple-200 mb-4">Sign in to access your account</p>
              }
              <span class="inline-flex items-center text-purple-300 font-semibold group-hover:gap-2 transition-all gap-1">
                {{ (isAuthenticated$ | async) ? 'Go to Account' : 'Learn More' }} <span class="text-xl">→</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 text-center hover:bg-white/10 transition">
            <div class="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400 mb-2">20</div>
            <p class="text-gray-300">Products Available</p>
          </div>
          <div class="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 text-center hover:bg-white/10 transition">
            <div class="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400 mb-2">4.5⭐</div>
            <p class="text-gray-300">Average Rating</p>
          </div>
          
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-button {
      text-transform: none !important;
    }
  `]
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
