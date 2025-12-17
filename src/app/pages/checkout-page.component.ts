import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CheckoutSummaryComponent } from './checkout/step1-summary.component';
import { CheckoutAddressComponent } from './checkout/step2-address.component';
import { CheckoutConfirmComponent } from './checkout/step3-confirm.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { selectIsAuthenticated } from '../state/auth/auth.selectors';
import * as AuthActions from '../state/auth/auth.actions';
import { CartIconComponent } from '../components/cart-icon/cart-icon.component';
import { WishlistIconComponent } from '../components/wishlist-icon/wishlist-icon.component';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [CommonModule, CheckoutSummaryComponent, CheckoutAddressComponent, CheckoutConfirmComponent, RouterLink, MatButtonModule, MatIconModule, MatSnackBarModule, CartIconComponent, WishlistIconComponent],
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
                *ngIf="isAuthenticated$ | async"
                type="button"
                mat-button
                routerLink="/admin/dashboard"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Dashboard
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

      <div class="p-6 relative overflow-hidden">
        <!-- Background Gradient Blobs -->
        <div class="absolute -top-40 -left-40 w-80 h-80 bg-linear-to-br from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-linear-to-tl from-emerald-600/20 to-transparent rounded-full blur-3xl"></div>

        <div class="mx-auto max-w-2xl relative z-10">
        <!-- Header -->
        <div class="sticky top-0 z-20 mb-8 bg-slate-900/80 backdrop-blur-md border-b border-white/10 -mx-6 px-6 py-4 rounded-b-2xl">
          <h1 class="text-3xl font-bold text-white">Checkout</h1>
          <p class="text-gray-400 text-sm">Step {{ currentStep }} of 3</p>
        </div>

        <!-- Step Content -->
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          @switch (currentStep) {
            @case (1) {
              <app-checkout-summary (nextStep)="goToStep(2)"></app-checkout-summary>
            }
            @case (2) {
              <app-checkout-address
                (nextStep)="onAddressNext($event)"
                (previousStep)="goToStep(1)"
                [initialAddress]="addressData"
              ></app-checkout-address>
            }
            @case (3) {
              <app-checkout-confirm
                [addressData]="addressData"
                (previousStep)="goToStep(2)"
              ></app-checkout-confirm>
            }
          }
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
export class CheckoutPageComponent {
  isAuthenticated$: any;

  currentStep = 1;
  addressData: any | null = null;

  constructor(
    private store: Store,
    private snackBar: MatSnackBar
  ) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  /**
   * Navigate to a specific step with validation
   * Step 2 requires step 1 to be completed (automatically done)
   * Step 3 requires addressData to be filled
   */
  goToStep(step: number): void {
    // Validate step 3: require address data
    if (step === 3 && !this.isAddressValid()) {
      this.snackBar.open(
        'Veuillez renseigner votre adresse de livraison avant de continuer.',
        'Fermer',
        { duration: 4000, panelClass: ['warning-snackbar'] }
      );
      return;
    }

    this.currentStep = step;
    window.scrollTo(0, 0);
  }

  /**
   * Check if address data is complete
   */
  private isAddressValid(): boolean {
    if (!this.addressData) return false;
    
    const { firstName, lastName, street, city, zipCode, country } = this.addressData;
    return !!(firstName && lastName && street && city && zipCode && country);
  }

  onAddressNext(addressPayload: any): void {
    this.addressData = addressPayload;
    this.goToStep(3);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
