import { Component, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

interface TokenResponse {
  access: string;
  refresh: string;
}
interface RefreshResponse {
  access: string;
}

@Component({
  standalone: true,
  selector: 'app-dev-auth',
  imports: [CommonModule, JsonPipe, RouterLink, MatButtonModule, MatCardModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <!-- Navbar -->
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">🔐</span>
            </div>
            <h1 class="text-2xl font-bold text-white">Authentication Endpoint</h1>
          </div>
          
          <button 
            type="button"
            mat-button
            routerLink="/dev"
            class="text-gray-200 hover:text-white transition"
          >
            ← Back to Dev
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="mx-auto max-w-2xl px-6 py-16">
        <div class="mb-12">
          <h2 class="text-5xl font-bold text-white mb-4">/api/auth/token/</h2>
          <p class="text-xl text-purple-200">Test authentication & token refresh endpoints</p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-4 mb-8">
          <button
            type="button"
            (click)="login()"
            class="bg-blue-600 hover:bg-blue-700 text-white flex-1 py-3 px-4 text-lg font-semibold rounded-lg transition"
          >
            POST /token (Login)
          </button>
          <button
            type="button"
            (click)="refresh()"
            class="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 py-3 px-4 text-lg font-semibold rounded-lg transition"
          >
            POST /refresh
          </button>
        </div>

        <!-- Response Section -->
        <div class="space-y-6">
          @if (loginResp(); as r) {
            <div class="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6">
              <h3 class="text-lg font-bold text-white mb-4">Login Response</h3>
              <pre class="rounded-lg bg-slate-950/50 p-4 text-sm text-green-300 overflow-x-auto">{{ r | json }}</pre>
            </div>
          }

          @if (refreshResp(); as rr) {
            <div class="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6">
              <h3 class="text-lg font-bold text-white mb-4">Refresh Response</h3>
              <pre class="rounded-lg bg-slate-950/50 p-4 text-sm text-green-300 overflow-x-auto">{{ rr | json }}</pre>
            </div>
          }

          @if (err()) {
            <div class="rounded-2xl bg-red-500/20 border border-red-500/50 p-6">
              <p class="text-red-200 font-medium flex items-center gap-2">
                <span class="text-lg">⚠️</span>
                {{ err() }}
              </p>
            </div>
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
export class DevAuthComponent {
  readonly loginResp = signal<TokenResponse | null>(null);
  readonly refreshResp = signal<RefreshResponse | null>(null);
  readonly err = signal<string | null>(null);

  async login(): Promise<void> {
    this.err.set(null);
    this.loginResp.set(null);
    const res = await fetch('/api/auth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demo', password: 'demo' }),
    });
    if (!res.ok) {
      this.err.set(`${res.status} ${res.statusText}`);
      return;
    }
    const data = (await res.json()) as TokenResponse;
    this.loginResp.set(data);
  }

  async refresh(): Promise<void> {
    this.err.set(null);
    this.refreshResp.set(null);
    const res = await fetch('/api/auth/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: 'mock-refresh-token' }),
    });
    if (!res.ok) {
      this.err.set(`${res.status} ${res.statusText}`);
      return;
    }
    const data = (await res.json()) as RefreshResponse;
    this.refreshResp.set(data);
  }
}
