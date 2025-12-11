import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import * as UserActions from '../../state/user/user.actions';
import * as UserSelectors from '../../state/user/user.selectors';
import { Observable } from 'rxjs';
import { OrderSummary } from '../../state/user/user.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { selectIsAuthenticated } from '../../state/auth/auth.selectors';
import * as AuthActions from '../../state/auth/auth.actions';
import { CartIconComponent } from '../../components/cart-icon/cart-icon.component';

@Component({
  selector: 'app-account-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, CartIconComponent],
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
        <h1
          class="text-4xl font-bold mb-8 text-center bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Mes Commandes
        </h1>

        <div class="space-y-4">
          <div *ngIf="(orders$ | async) as orders">
            <div *ngIf="orders.length === 0" class="text-center py-12">
              <p class="text-gray-400 text-lg">Vous n'avez pas encore de commandes</p>
              <a
                routerLink="/shop/products"
                class="mt-4 inline-block px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Continuer vos courses
              </a>
            </div>

            <div *ngFor="let order of orders" class="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <!-- Order Info -->
                <div class="flex-1">
                  <p class="text-sm text-gray-400 mb-1">Commande du {{ order.date | date: 'dd/MM/yyyy' }}</p>
                  <p class="text-white font-semibold text-lg">{{ order.id }}</p>
                  <p class="text-gray-400 text-sm mt-2">{{ order.itemCount }} article(s)</p>
                </div>

                <!-- Status Badge -->
                <div class="flex items-center gap-4">
                  <div
                    [ngClass]="{
                      'bg-yellow-900/30 border-yellow-500/30': order.status === 'en_cours',
                      'bg-blue-900/30 border-blue-500/30': order.status === 'expediee',
                      'bg-green-900/30 border-green-500/30': order.status === 'livree'
                    }"
                    class="px-4 py-2 rounded-lg border"
                  >
                    <span
                      [ngClass]="{
                        'text-yellow-400': order.status === 'en_cours',
                        'text-blue-400': order.status === 'expediee',
                        'text-green-400': order.status === 'livree'
                      }"
                      class="font-semibold text-sm"
                    >
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </div>

                  <!-- Total -->
                  <div class="text-right">
                    <p class="text-gray-400 text-sm">Total</p>
                    <p class="text-white font-bold text-xl">{{ order.total | currency: 'EUR': 'symbol': '1.2-2' }}</p>
                  </div>

                  <!-- Details Button -->
                  <button
                    [routerLink]="['/account/orders', order.id]"
                    class="px-6 py-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all whitespace-nowrap"
                  >
                    Détails
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="!(orders$ | async)" class="text-center py-12">
            <p class="text-gray-400">Chargement de vos commandes...</p>
          </div>
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
export class AccountOrdersComponent implements OnInit {
  orders$: Observable<OrderSummary[]>;
  isAuthenticated$: any;

  constructor(private store: Store) {
    this.orders$ = this.store.select(UserSelectors.selectUserOrders);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUserOrders());
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
