import {
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import * as UserActions from '../../state/user/user.actions';
import * as UserSelectors from '../../state/user/user.selectors';
import { Observable } from 'rxjs';
import { User, UserPreferences } from '../../state/user/user.actions';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { selectIsAuthenticated } from '../../state/auth/auth.selectors';
import * as AuthActions from '../../state/auth/auth.actions';
import { CartIconComponent } from '../../components/cart-icon/cart-icon.component';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, RouterLink, CartIconComponent],
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

      <div class="mx-auto max-w-2xl px-6 py-8">
        <div class="max-w-2xl mx-auto">
        <h1
          class="text-4xl font-bold mb-8 text-center bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Mon Profil
        </h1>

        <div
          *ngIf="user$ | async as user"
          class="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 space-y-8"
        >
          <!-- User Info Section -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-emerald-400">Informations Personnelles</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-300 mb-2">Nom d'utilisateur</label>
                <p class="text-white font-medium">{{ user.username }}</p>
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-2">Email</label>
                <p class="text-white font-medium">{{ user.email }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-gray-300 mb-2">Nom Complet</label>
                <p class="text-white font-medium">{{ user.fullName || 'Non renseigné' }}</p>
              </div>
            </div>
          </div>

          <!-- Preferences Section -->
          <div class="space-y-4 border-t border-white/10 pt-6">
            <h2 class="text-xl font-semibold text-emerald-400">Préférences</h2>
            <form
              *ngIf="preferencesForm"
              [formGroup]="preferencesForm"
              (ngSubmit)="onSavePreferences()"
              class="space-y-4"
            >
              <!-- Newsletter Toggle -->
              <div class="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div>
                  <label class="block font-medium text-white mb-1">Newsletter</label>
                  <p class="text-sm text-gray-400">Recevez nos meilleures offres par email</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    formControlName="newsletter"
                    class="w-5 h-5 text-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <!-- Min Rating -->
              <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                <label class="block font-medium text-white mb-2">Note Minimale par Défaut</label>
                <div class="flex items-center gap-4">
                  <input
                    type="range"
                    formControlName="defaultMinRating"
                    min="0"
                    max="5"
                    step="0.5"
                    class="flex-1 cursor-pointer"
                  />
                  <span class="text-emerald-400 font-semibold">{{ preferencesForm.get('defaultMinRating')?.value }}/5</span>
                </div>
                <p class="text-sm text-gray-400 mt-2">Afficher uniquement les produits avec une note égale ou supérieure</p>
              </div>

              <!-- Save Button -->
              <button
                type="submit"
                [disabled]="loading$ | async"
                class="w-full mt-6 px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50"
              >
                {{ (loading$ | async) ? 'Enregistrement...' : 'Enregistrer les Préférences' }}
              </button>
            </form>
          </div>

          <!-- Address Section -->
          <div class="space-y-4 border-t border-white/10 pt-6" *ngIf="user.defaultAddress">
            <h2 class="text-xl font-semibold text-emerald-400">Adresse par Défaut</h2>
            <div class="bg-white/5 p-4 rounded-xl border border-white/10">
              <p class="text-white">{{ user.defaultAddress.street }}</p>
              <p class="text-white">{{ user.defaultAddress.zipCode }} {{ user.defaultAddress.city }}</p>
              <p class="text-white">{{ user.defaultAddress.country }}</p>
            </div>
          </div>

          <!-- Orders Summary -->
          <div class="space-y-4 border-t border-white/10 pt-6">
            <h2 class="text-xl font-semibold text-emerald-400">Résumé des Commandes</h2>
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <p class="text-gray-400 text-sm">Total Commandes</p>
                <p class="text-2xl font-bold text-emerald-400">{{ user.orders.length }}</p>
              </div>
              <div class="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <p class="text-gray-400 text-sm">Montant Total Dépensé</p>
                <p class="text-2xl font-bold text-blue-400">
                  {{ (getTotalSpent(user.orders) | number: '1.2-2') }}€
                </p>
              </div>
              <div class="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <p class="text-gray-400 text-sm">Dernière Commande</p>
                <p class="text-lg font-bold text-purple-400">
                  {{ (getLastOrderDate(user.orders) | date: 'dd/MM/yy') || 'Aucune' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="!(user$ | async)" class="text-center py-12">
          <p class="text-gray-400">Chargement du profil...</p>
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
export class AccountProfileComponent implements OnInit {
  user$: Observable<any>;
  loading$: Observable<boolean>;
  preferencesForm: FormGroup;
  isAuthenticated$: any;

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    this.user$ = this.store.select(UserSelectors.selectCurrentUser);
    this.loading$ = this.store.select(UserSelectors.selectUserLoading);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.preferencesForm = this.fb.group({
      newsletter: [false],
      defaultMinRating: [0],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUserProfile());

    // Subscribe to user to update form when data loads
    this.user$.subscribe((user) => {
      if (user && user.preferences) {
        this.preferencesForm.patchValue({
          newsletter: user.preferences.newsletter,
          defaultMinRating: user.preferences.defaultMinRating || 0,
        });
      }
    });
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  onSavePreferences(): void {
    if (this.preferencesForm.valid) {
      const preferences: Partial<UserPreferences> = this.preferencesForm.value;
      this.store.dispatch(UserActions.updateUserPreferences({ preferences }));
    }
  }

  getTotalSpent(orders: any[]): number {
    return orders.reduce((sum, order) => sum + order.total, 0);
  }

  getLastOrderDate(orders: any[]): string | null {
    if (orders.length === 0) return null;
    return orders[0].date;
  }
}
