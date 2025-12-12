import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartBreakdown,
  selectPromoError,
  selectPromoLoading,
  selectAppliedPromos,
} from '../../state/cart/cart.selectors';
import { Observable } from 'rxjs';
import { CartItem, CartPromoResult } from '../../state/cart/cart.actions';
import * as CartActions from '../../state/cart/cart.actions';

@Component({
  standalone: true,
  selector: 'app-checkout-summary',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Step Indicator -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
          <div class="flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-full font-bold">
            ✓
          </div>
          <div class="flex-1 h-1 bg-emerald-600 mx-4"></div>
        </div>
        <div class="flex items-center">
          <div class="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold">
            2
          </div>
          <div class="flex-1 h-1 bg-gray-600 mx-4"></div>
        </div>
        <div class="flex items-center">
          <div class="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full font-bold">
            3
          </div>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-6">Order Summary</h2>

      <!-- Items List -->
      <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-3">
        @for (item of items$ | async; track item.id) {
          <div class="flex justify-between items-center pb-3 border-b border-white/10 last:border-b-0">
            <div>
              <p class="font-semibold text-white">{{ item.name }}</p>
              <p class="text-sm text-gray-400">{{ item.quantity }} × €{{ item.price.toFixed(2) }}</p>
            </div>
            <p class="font-bold text-emerald-400">€{{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        }
      </div>

      <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
        <div class="flex flex-wrap gap-3">
          <input
            type="text"
            [(ngModel)]="promoCode"
            placeholder="Code promo"
            class="w-full sm:flex-1 bg-slate-900/40 border border-white/20 text-white px-4 py-3 rounded-lg placeholder-gray-500 focus:border-emerald-400 outline-none transition"
          />
          <button
            type="button"
            (click)="applyPromo()"
            [disabled]="(promoLoading$ | async) || !promoCode.trim()"
            class="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-600 text-white px-5 py-3 rounded-lg font-semibold transition flex items-center justify-center"
          >
            {{ (promoLoading$ | async) ? 'Application en cours…' : 'Appliquer' }}
          </button>
        </div>
        <p *ngIf="promoError$ | async as error" class="text-xs text-rose-300">
          {{ error }}
        </p>
        <ng-container *ngIf="appliedPromos$ | async as promos">
          <div *ngIf="promos.length" class="flex flex-wrap gap-2 text-xs text-emerald-200">
            <span
              *ngFor="let promo of promos"
              class="bg-emerald-600/20 border border-emerald-500/40 px-3 py-1 rounded-full"
            >
              {{ promo }}
            </span>
            <button type="button" (click)="clearPromo()" class="underline">Supprimer</button>
          </div>
        </ng-container>
        <ng-container *ngIf="breakdown$ | async as breakdown">
          <div class="flex justify-between text-gray-300">
            <span>Sous-total</span>
            <span>€{{ breakdown.itemsTotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-300">
            <span>Remise(s)</span>
            <span class="text-emerald-400">-€{{ breakdown.discount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-300">
            <span>Frais de port</span>
            <span>€{{ breakdown.shipping.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-300">
            <span>Taxes</span>
            <span>€{{ breakdown.taxes.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between border-t border-white/10 pt-4 text-lg font-bold">
            <span class="text-white">Total</span>
            <span class="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              €{{ breakdown.grandTotal.toFixed(2) }}
            </span>
          </div>
        </ng-container>
      </div>

      <!-- Shipping Info -->
      <div class="bg-emerald-600/10 border border-emerald-500/30 rounded-2xl p-4 text-sm text-emerald-300">
        <p class="font-semibold mb-2">📦 Shipping Information</p>
        <p>Standard delivery: 2-3 business days</p>
        <p class="text-xs text-gray-400 mt-1">Free shipping on orders over €50</p>
      </div>

      <!-- Navigation -->
      <div class="flex gap-4">
        <button
          type="button"
          routerLink="/shop/products"
          class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-lg font-semibold transition"
        >
          ← Continue Shopping
        </button>
        <button
          type="button"
          (click)="onNextStep()"
          class="flex-1 bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white py-3 px-4 rounded-lg font-semibold transition"
        >
          Continue to Address →
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class CheckoutSummaryComponent {
  @Output() nextStep = new EventEmitter<void>();

  items$: Observable<CartItem[]>;
  breakdown$: Observable<CartPromoResult>;
  promoLoading$: Observable<boolean>;
  promoError$: Observable<string | null>;
  appliedPromos$: Observable<string[]>;
  promoCode = '';

  constructor(private store: Store) {
    this.items$ = this.store.select(selectCartItems);
    this.breakdown$ = this.store.select(selectCartBreakdown);
    this.promoLoading$ = this.store.select(selectPromoLoading);
    this.promoError$ = this.store.select(selectPromoError);
    this.appliedPromos$ = this.store.select(selectAppliedPromos);
  }

  applyPromo(): void {
    const code = this.promoCode?.trim();
    if (!code) {
      return;
    }
    this.store.dispatch(CartActions.applyPromoCode({ code }));
  }

  clearPromo(): void {
    this.store.dispatch(CartActions.clearCartPromo());
  }

  onNextStep(): void {
    this.nextStep.emit();
  }
}
