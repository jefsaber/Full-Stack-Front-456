import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartTotal,
  selectShippingCost,
  selectTotalWithShipping,
} from '../../state/cart/cart.selectors';
import { Observable } from 'rxjs';
import { CartItem } from '../../state/cart/cart.actions';

@Component({
  standalone: true,
  selector: 'app-checkout-summary',
  imports: [CommonModule, RouterLink],
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

      <!-- Cost Breakdown -->
      <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
        <div class="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>€{{ (cartTotal$ | async)?.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-gray-300">
          <span>Shipping</span>
          <span>€{{ (shippingCost$ | async)?.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-gray-300">
          <span>Tax (19%)</span>
          <span>€{{ (((cartTotal$ | async) ?? 0) * 0.19).toFixed(2) }}</span>
        </div>
        <div class="flex justify-between border-t border-white/10 pt-4 text-lg font-bold">
          <span class="text-white">Total</span>
          <span class="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            €{{ (totalWithShipping$ | async)?.toFixed(2) }}
          </span>
        </div>
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
  cartTotal$: Observable<number>;
  shippingCost$: Observable<number>;
  totalWithShipping$: Observable<number>;

  constructor(private store: Store) {
    this.items$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectCartTotal);
    this.shippingCost$ = this.store.select(selectShippingCost);
    this.totalWithShipping$ = this.store.select(selectTotalWithShipping);
  }

  onNextStep(): void {
    this.nextStep.emit();
  }
}
