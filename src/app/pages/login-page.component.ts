import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import * as AuthActions from '../state/auth/auth.actions';
import { selectAuthLoading, selectAuthError, selectAccessToken, selectIsAuthenticated } from '../state/auth/auth.selectors';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import * as AuthActionsLogout from '../state/auth/auth.actions';
import { CartIconComponent } from '../components/cart-icon/cart-icon.component';
import { WishlistIconComponent } from '../components/wishlist-icon/wishlist-icon.component';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    CommonModule,
    RouterLink,
    LoginFormComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CartIconComponent,
    WishlistIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
                *ngIf="isAuthenticated$ | async"
                routerLink="/admin/dashboard"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Admin
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

      <div class="flex items-center justify-center px-4 relative overflow-hidden min-h-[calc(100vh-80px)]">
      <!-- Animated background elements -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div class="w-full max-w-md relative z-10">
        <mat-card class="shadow-2xl border border-white/10 bg-slate-900/80 backdrop-blur-sm">
          <mat-card-header class="pb-6">
            <div class="flex items-center justify-center mb-6">
              <div class="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <span class="text-3xl">🛍️</span>
              </div>
            </div>
            <p class="text-center text-purple-200 mt-3 text-sm font-medium">Sign in to your account</p>
          </mat-card-header>

          <mat-card-content class="space-y-6">
            <!-- Loading State -->
            @if (loading$ | async) {
              <div class="flex justify-center py-8">
                <mat-spinner diameter="40" color="accent"></mat-spinner>
              </div>
            }

            <!-- Error Message -->
            @if (error$ | async; as error) {
              <div class="p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
                <p class="text-red-200 font-medium text-sm flex items-center gap-2">
                  <span class="text-lg">⚠️</span>
                  {{ error }}
                </p>
              </div>
            }

            <!-- Login Form -->
            <app-login-form 
              (submit)="handleLogin($event)"
            ></app-login-form>

            <div class="pt-4 border-t border-white/10">
              <p class="text-center text-purple-300 text-xs">
                Demo credentials: <strong class="text-purple-100">demo / demo</strong>
              </p>
            </div>
          </mat-card-content>

          <mat-card-actions class="flex gap-2 pt-6">
            <button 
              type="button"
              routerLink="/app"
              mat-stroked-button
              class="flex-1 text-purple-300 border-purple-400/50 hover:border-purple-400 hover:text-purple-100"
            >
              ← Back to Home
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Footer -->
        <p class="text-center text-gray-400 text-xs mt-6">
          Everything is stored locally • No data sent to servers
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-button {
      text-transform: none !important;
    }
  `]
})
export class LoginPageComponent implements OnInit, OnDestroy {
  loading$: any;
  error$: any;
  isAuthenticated$: any;
  private destroy$ = new Subject<void>();
  private returnUrl = '/shop/products';

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    const requested = this.route.snapshot.queryParamMap.get('returnUrl');
    if (requested) {
      this.returnUrl = requested;
    }
    // Listen for authentication success and navigate
    this.store
      .select(selectAccessToken)
      .pipe(
        filter((token: string | null) => token !== null),
        takeUntil(this.destroy$)
      )
      .subscribe((token) => {
        // Navigate to /app after successful login
        this.router.navigateByUrl(this.returnUrl);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.store.dispatch(AuthActionsLogout.logout());
  }

  handleLogin(credentials: { username: string; password: string }): void {
    this.store.dispatch(AuthActions.login({
      username: credentials.username,
      password: credentials.password,
    }));
  }
}
