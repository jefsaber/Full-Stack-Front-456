import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import * as AuthActions from '../state/auth/auth.actions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../state/auth/auth.selectors';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    CommonModule,
    RouterLink,
    LoginFormComponent,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
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
            <mat-card-title class="text-4xl font-bold text-center text-white">
              My Shop
            </mat-card-title>
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
})
export class LoginPageComponent implements OnInit {
  loading$: any;
  error$: any;
  isAuthenticated$: any;

  constructor(private store: Store, private router: Router) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    // Navigate to /app when user is authenticated
    this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.router.navigate(['/app']);
      }
    });
  }

  handleLogin(credentials: { username: string; password: string }): void {
    this.store.dispatch(AuthActions.login({
      username: credentials.username,
      password: credentials.password,
    }));
  }
}
