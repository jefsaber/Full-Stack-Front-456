import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-dev-index',
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <!-- Navbar -->
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">🛍️</span>
            </div>
            <h1 class="text-2xl font-bold text-white">My Shop - Dev</h1>
          </div>
          
          <button 
            type="button"
            mat-button
            routerLink="/app"
            class="text-gray-200 hover:text-white transition"
          >
            ← Back to Home
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="mx-auto max-w-4xl px-6 py-16">
        <div class="mb-12">
          <h2 class="text-5xl font-bold text-white mb-4">Development Tools</h2>
          <p class="text-xl text-purple-200">API endpoints & Mock Service Worker testing</p>
        </div>

        <!-- Dev Pages Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Auth Endpoint -->
          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 p-8 hover:border-blue-400/80 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer" routerLink="/dev/auth">
            <div class="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
            <div class="relative z-10">
              <div class="w-12 h-12 bg-blue-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/50 transition">
                <span class="text-xl">🔐</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Authentication</h3>
              <p class="text-blue-200 mb-4 text-sm">POST /api/auth/token/</p>
              <p class="text-blue-100 text-sm">Test login & token refresh endpoints</p>
              <span class="inline-flex items-center text-blue-300 font-semibold group-hover:gap-2 transition-all gap-1 mt-4">
                Open <span class="text-lg">→</span>
              </span>
            </div>
          </div>

          <!-- Products Endpoint -->
          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 p-8 hover:border-purple-400/80 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer" routerLink="/dev/products">
            <div class="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
            <div class="relative z-10">
              <div class="w-12 h-12 bg-purple-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/50 transition">
                <span class="text-xl">📦</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Products</h3>
              <p class="text-purple-200 mb-4 text-sm">GET /api/products/</p>
              <p class="text-purple-100 text-sm">Browse & filter products endpoint</p>
              <span class="inline-flex items-center text-purple-300 font-semibold group-hover:gap-2 transition-all gap-1 mt-4">
                Open <span class="text-lg">→</span>
              </span>
            </div>
          </div>

          <!-- Profile Endpoint -->
          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 border border-indigo-500/50 p-8 hover:border-indigo-400/80 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer" routerLink="/dev/profile">
            <div class="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
            <div class="relative z-10">
              <div class="w-12 h-12 bg-indigo-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/50 transition">
                <span class="text-xl">👤</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Profile</h3>
              <p class="text-indigo-200 mb-4 text-sm">GET & PATCH /api/me/</p>
              <p class="text-indigo-100 text-sm">Inspect and update the mocked user profile</p>
              <span class="inline-flex items-center text-indigo-300 font-semibold group-hover:gap-2 transition-all gap-1 mt-4">
                Open <span class="text-lg">→</span>
              </span>
            </div>
          </div>

          <!-- Product Rating Endpoint -->
          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 p-8 hover:border-green-400/80 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 cursor-pointer" routerLink="/dev/products/1/rating">
            <div class="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
            <div class="relative z-10">
              <div class="w-12 h-12 bg-green-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-500/50 transition">
                <span class="text-xl">⭐</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Product Rating</h3>
              <p class="text-green-200 mb-4 text-sm">GET /api/products/:id/rating/</p>
              <p class="text-green-100 text-sm">Check product ratings by ID</p>
              <span class="inline-flex items-center text-green-300 font-semibold group-hover:gap-2 transition-all gap-1 mt-4">
                Open <span class="text-lg">→</span>
              </span>
            </div>
          </div>

          <!-- Orders Endpoint -->
          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/50 p-8 hover:border-orange-400/80 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer" routerLink="/dev/orders">
            <div class="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
            <div class="relative z-10">
              <div class="w-12 h-12 bg-orange-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-500/50 transition">
                <span class="text-xl">🧾</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Orders</h3>
              <p class="text-orange-200 mb-4 text-sm">GET /api/me/orders/ & GET /api/orders/:id/</p>
              <p class="text-orange-100 text-sm">Inspect order lists & details</p>
              <span class="inline-flex items-center text-orange-300 font-semibold group-hover:gap-2 transition-all gap-1 mt-4">
                Open <span class="text-lg">→</span>
              </span>
            </div>
          </div>

          <!-- Cart Validation Endpoint -->
          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/50 p-8 hover:border-pink-400/80 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer" routerLink="/dev/cart">
            <div class="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
            <div class="relative z-10">
              <div class="w-12 h-12 bg-pink-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-pink-500/50 transition">
                <span class="text-xl">🛒</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Cart Validation</h3>
              <p class="text-pink-200 mb-4 text-sm">POST /api/cart/validate-stock/</p>
              <p class="text-pink-100 text-sm">Simulate stock checks before checkout</p>
              <span class="inline-flex items-center text-pink-300 font-semibold group-hover:gap-2 transition-all gap-1 mt-4">
                Open <span class="text-lg">→</span>
              </span>
            </div>
          </div>

          <!-- Reviews Endpoint -->
          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 to-sky-500/20 border border-cyan-500/50 p-8 hover:border-cyan-400/80 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer" routerLink="/dev/reviews">
            <div class="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
            <div class="relative z-10">
              <div class="w-12 h-12 bg-cyan-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/50 transition">
                <span class="text-xl">💬</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Reviews</h3>
              <p class="text-cyan-200 mb-4 text-sm">GET & POST /api/products/:id/reviews/</p>
              <p class="text-cyan-100 text-sm">Play with review filters and submissions</p>
              <span class="inline-flex items-center text-cyan-300 font-semibold group-hover:gap-2 transition-all gap-1 mt-4">
                Open <span class="text-lg">→</span>
              </span>
            </div>
          </div>

          <!-- Admin Stats Endpoint -->
          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-500/20 to-slate-700/20 border border-slate-500/50 p-8 hover:border-slate-400/80 hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-300 cursor-pointer" routerLink="/dev/admin">
            <div class="absolute top-0 right-0 w-40 h-40 bg-slate-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
            <div class="relative z-10">
              <div class="w-12 h-12 bg-slate-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-slate-500/50 transition">
                <span class="text-xl">📊</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Admin Stats</h3>
              <p class="text-slate-200 mb-4 text-sm">GET /api/admin/stats/</p>
              <p class="text-slate-100 text-sm">Inspect the mock totals used by the admin dashboard.</p>
              <span class="inline-flex items-center text-slate-300 font-semibold group-hover:gap-2 transition-all gap-1 mt-4">
                Open <span class="text-lg">→</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div class="mt-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8">
          <h3 class="text-xl font-bold text-white mb-4">About Dev Pages</h3>
          <p class="text-gray-300 mb-3">
            These pages help you test and debug API endpoints in development. All data is mocked using Mock Service Worker (MSW) for offline development.
          </p>
          <p class="text-gray-400 text-sm">
            💡 Tip: Use your browser's DevTools Network tab to inspect requests and responses.
          </p>
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
export class DevIndexComponent {}
