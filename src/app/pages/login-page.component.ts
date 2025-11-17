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
    <div class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <mat-card class="shadow-xl">
          <mat-card-header>
            <mat-card-title class="text-3xl font-bold text-center text-gray-900">
              My Shop
            </mat-card-title>
            <p class="text-center text-gray-600 mt-2">Sign in to your account</p>
          </mat-card-header>

          <mat-card-content class="space-y-6">
            <!-- Loading State -->
            @if (loading$ | async) {
              <div class="flex justify-center py-6">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
            }

            <!-- Error Message -->
            @if (error$ | async; as error) {
              <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-700 font-medium">{{ error }}</p>
              </div>
            }

            <!-- Login Form -->
            <app-login-form 
              (submit)="handleLogin($event)"
            ></app-login-form>

            <div class="pt-4 border-t border-gray-200">
              <p class="text-center text-gray-600 text-sm">
                Demo credentials: <strong>demo / demo</strong>
              </p>
            </div>
          </mat-card-content>

          <mat-card-actions class="flex gap-2">
            <button 
              type="button"
              routerLink="/app"
              mat-stroked-button
              class="flex-1"
            >
              ← Back to Home
            </button>
          </mat-card-actions>
        </mat-card>
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
