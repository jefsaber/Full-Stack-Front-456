import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import * as UserActions from '../../state/user/user.actions';
import * as UserSelectors from '../../state/user/user.selectors';
import { Observable } from 'rxjs';
import { OrderDetail } from '../../state/user/user.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { selectIsAuthenticated } from '../../state/auth/auth.selectors';
import * as AuthActions from '../../state/auth/auth.actions';
import { CartIconComponent } from '../../components/cart-icon/cart-icon.component';
import { WishlistIconComponent } from '../../components/wishlist-icon/wishlist-icon.component';

@Component({
  selector: 'app-account-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, CartIconComponent, WishlistIconComponent],
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

      <div class="mx-auto max-w-4xl px-6 py-8">
        <div class="max-w-4xl mx-auto">

        <div *ngIf="order$ | async as order" class="space-y-6">
          <!-- Header -->
          <div class="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 class="text-3xl font-bold text-white mb-2">{{ order.id }}</h1>
                <p class="text-gray-400">Passée le {{ order.date | date: 'dd MMMM yyyy' }}</p>
              </div>
              <div
                [ngClass]="{
                  'bg-yellow-900/30 border-yellow-500/30': order.status === 'en_cours',
                  'bg-blue-900/30 border-blue-500/30': order.status === 'expediee',
                  'bg-green-900/30 border-green-500/30': order.status === 'livree'
                }"
                class="px-6 py-3 rounded-lg border text-center"
              >
                <span
                  [ngClass]="{
                    'text-yellow-400': order.status === 'en_cours',
                    'text-blue-400': order.status === 'expediee',
                    'text-green-400': order.status === 'livree'
                  }"
                  class="font-bold text-lg"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
            </div>

            <!-- Tracking -->
            <div *ngIf="order.trackingUrl" class="pt-6 border-t border-white/10">
              <a
                [href]="order.trackingUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Suivre votre colis →
              </a>
            </div>
          </div>

          <!-- Items Section -->
          <div class="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <h2 class="text-2xl font-bold text-white mb-6">Articles commandés</h2>
            <div class="space-y-4">
              <div *ngFor="let item of order.items" class="flex justify-between items-center pb-4 border-b border-white/10">
                <div class="flex-1">
                  <p class="text-white font-semibold">{{ item.productName }}</p>
                  <p class="text-gray-400 text-sm">Quantité : {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="text-white">{{ item.price | currency: 'EUR': 'symbol': '1.2-2' }} x{{ item.quantity }}</p>
                  <p class="text-emerald-400 font-semibold">{{ item.price * item.quantity | currency: 'EUR': 'symbol': '1.2-2' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Section -->
          <div class="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <h2 class="text-2xl font-bold text-white mb-6">Adresse de livraison</h2>
            <div class="space-y-3 text-white">
              <p>Street: {{ order.deliveryAddress.street }}</p>
              <p>Zip Code: {{ order.deliveryAddress.zipCode }} City: {{ order.deliveryAddress.city }}</p>
              <p>Country: {{ order.deliveryAddress.country }}</p>
            </div>
          </div>

          <!-- Cost Summary -->
          <div class="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <h2 class="text-2xl font-bold text-white mb-6">Résumé des frais</h2>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-400">Sous-total</span>
                <span class="text-white font-semibold">{{ order.subtotal | currency: 'EUR': 'symbol': '1.2-2' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-400">Taxes (19%)</span>
                <span class="text-white font-semibold">{{ order.tax | currency: 'EUR': 'symbol': '1.2-2' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-400">
                  Frais de port
                  <span class="text-xs text-gray-500">({{ order.deliveryOption === 'express' ? 'Express' : 'Standard' }})</span>
                </span>
                <span class="text-white font-semibold">{{ order.shipping | currency: 'EUR': 'symbol': '1.2-2' }}</span>
              </div>
              <div class="border-t border-white/10 pt-4 flex justify-between items-center">
                <span class="text-lg font-bold text-white">Total</span>
                <span class="text-2xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {{ order.total | currency: 'EUR': 'symbol': '1.2-2' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="!(order$ | async)" class="text-center py-12">
          <p class="text-gray-400">Chargement des détails de la commande...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="(error$ | async) as error" class="bg-red-900/30 border border-red-500/30 rounded-xl p-6">
          <p class="text-red-400">{{ error }}</p>
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
export class AccountOrderDetailsComponent implements OnInit {
  order$: Observable<OrderDetail | null>;
  error$: Observable<string | null>;
  isAuthenticated$: any;

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.order$ = this.store.select(UserSelectors.selectSelectedOrder);
    this.error$ = this.store.select(UserSelectors.selectUserError);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const orderId = params['id'];
      if (orderId) {
        this.store.dispatch(UserActions.loadOrderDetail({ orderId }));
      }
    });
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      en_cours: 'En cours',
      expediee: 'Expédiée',
      livree: 'Livrée',
    };
    return labels[status] || status;
  }
}
