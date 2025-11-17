import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          formControlName="username"
          placeholder="demo"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          [disabled]="loading()"
        />
        @if (loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched) {
          <p class="text-red-500 text-xs mt-1">Username is required</p>
        }
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          formControlName="password"
          placeholder="demo"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          [disabled]="loading()"
        />
        @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
          <p class="text-red-500 text-xs mt-1">Password is required</p>
        }
      </div>

      @if (error()) {
        <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-700 text-sm">{{ error() }}</p>
        </div>
      }

      <button
        type="submit"
        [disabled]="loginForm.invalid || loading()"
        class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        @if (loading()) {
          <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Signing in...
        } @else {
          Sign In
        }
      </button>
    </form>
  `,
})
export class LoginFormComponent {
  @Input() loading = (): boolean => false;
  @Input() error = (): string | null => null;
  @Output() submit = new EventEmitter<{ username: string; password: string }>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['demo', Validators.required],
      password: ['demo', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.submit.emit(this.loginForm.value);
    }
  }
}
