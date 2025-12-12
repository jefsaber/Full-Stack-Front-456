import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 text-white">
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-xl shadow-purple-900/50">
                <span class="text-white text-lg font-bold">🛍️</span>
              </div>
              <div>
                <p class="text-xs uppercase tracking-[0.4em] text-purple-200">My Shop</p>
                <h1 class="text-xl font-semibold text-white">Accueil</h1>
              </div>
            </div>

            <div class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-200">
              <button mat-button type="button" routerLink="/" class="hover:text-white transition">Home</button>
              <button mat-button type="button" routerLink="/shop/products" class="hover:text-white transition">Products</button>
              <button mat-button type="button" routerLink="/shop/rating" class="hover:text-white transition">Ratings</button>
              <button mat-button type="button" routerLink="/dev" class="hover:text-white transition">Dev</button>
            </div>
          </div>
        </div>
      </nav>

      <main class="mx-auto max-w-5xl px-6 py-16 relative">
        <div class="absolute -top-28 -right-10 w-64 h-64 bg-gradient-to-br from-purple-500/40 to-transparent blur-3xl"></div>
        <div class="absolute -bottom-32 left-0 w-72 h-72 bg-gradient-to-br from-emerald-500/40 to-transparent blur-3xl"></div>

        <section class="bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl shadow-black/30 backdrop-blur">
          <div class="space-y-6">
            <div>
              <p class="text-sm uppercase tracking-[0.5em] text-purple-200">Bienvenue</p>
              <h2 class="text-4xl md:text-5xl font-bold text-white">Bienvenue sur My Shop</h2>
              <p class="text-lg text-gray-300 mt-2">Choisis une zone :</p>
            </div>

            <div class="flex flex-wrap gap-4">
              <button
                type="button"
                routerLink="/dev"
                class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-amber-900/60 hover:translate-y-0.5 transition-transform"
              >
                <span>Zone de test MSW</span>
              </button>
              <button
                type="button"
                routerLink="/app"
                class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-emerald-900/60 hover:-translate-y-0.5 transition-transform"
              >
                <span>Accéder à l’app</span>
              </button>
            </div>
          </div>
        </section>

        <section class="mt-12 grid gap-6 md:grid-cols-2">
          <article class="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent p-6 space-y-3">
            <p class="text-sm text-gray-300">Pourquoi visiter ?</p>
            <h3 class="text-2xl font-semibold text-white">Explore l’app au calme</h3>
            <p class="text-gray-300 text-sm">Teste les parcours, découvre les pages produits et prépare tes scénarios avant la mise en production.</p>
          </article>
          <article class="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 space-y-3">
            <p class="text-sm text-gray-300">Besoin de mock data ?</p>
            <h3 class="text-2xl font-semibold text-white">Utilise la zone dev</h3>
            <p class="text-gray-300 text-sm">Lance les endpoints mockés pour tester l’auth, les produits, les commandes et les notes produit.</p>
          </article>
        </section>
      </main>
    </div>
  `,
})
export class HomeComponent {
}
