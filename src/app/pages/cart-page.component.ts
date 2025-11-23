import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as CartActions from '../state/cart/cart.actions';
import {
  selectCartItems,
  selectCartTotal,
  selectCartEmpty,
} from '../state/cart/cart.selectors';
import { Observable } from 'rxjs';
import { CartItem } from '../state/cart/cart.actions';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
      <!-- Background Gradient Blobs -->
      <div class="absolute -top-40 -left-40 w-80 h-80 bg-linear-to-br from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-linear-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl"></div>

      <div class="mx-auto max-w-6xl relative z-10">
        <!-- Header -->
        <div class="sticky top-0 z-20 mb-8 bg-slate-900/80 backdrop-blur-md border-b border-white/10 -mx-6 px-6 py-4 rounded-b-2xl">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                Shopping Cart
              </h1>
              <p class="text-gray-400 text-sm">Review your items before checkout</p>
            </div>
            <button
              type="button"
              routerLink="/shop/products"
              class="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

        @if (cartEmpty$ | async) {
          <!-- Empty Cart State -->
          <div class="text-center py-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <p class="text-4xl mb-4">🛒</p>
            <h2 class="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p class="text-gray-400 mb-6">Start shopping to add items to your cart</p>
            <a
              routerLink="/shop/products"
              class="inline-block bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 px-6 rounded-lg font-semibold transition"
            >
              Browse Products
            </a>
          </div>
        } @else {
          <!-- Cart Content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Items Column -->
            <div class="lg:col-span-2 space-y-4">
              @for (item of items$ | async; track item.id) {
                <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex gap-4 hover:border-blue-400/50 transition">
                  <!-- Item Info -->
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-white mb-1">{{ item.name }}</h3>
                    <p class="text-gray-400 mb-2">€{{ item.price.toFixed(2) }}</p>
                    <div class="flex items-center gap-2">
                      <span class="text-yellow-400">★</span>
                      <span class="text-sm text-gray-300">{{ item.avgRating }}</span>
                    </div>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                    <button
                      type="button"
                      (click)="decreaseQuantity(item.id, item.quantity)"
                      class="text-white hover:text-blue-400 transition font-bold"
                    >
                      −
                    </button>
                    <span class="text-white font-semibold w-8 text-center">{{ item.quantity }}</span>
                    <button
                      type="button"
                      (click)="increaseQuantity(item.id, item.quantity)"
                      class="text-white hover:text-blue-400 transition font-bold"
                    >
                      +
                    </button>
                  </div>

                  <!-- Subtotal -->
                  <div class="text-right min-w-32">
                    <p class="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      €{{ (item.price * item.quantity).toFixed(2) }}
                    </p>
                    <button
                      type="button"
                      (click)="removeItem(item.id)"
                      class="text-red-400 hover:text-red-300 text-sm mt-2 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Summary Column -->
            <div class="lg:col-span-1">
              <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-32">
                <h3 class="text-xl font-bold text-white mb-6">Order Summary</h3>

                <div class="space-y-3 mb-6 pb-6 border-b border-white/10">
                  <div class="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>€{{ (cartTotal$ | async)?.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>€{{ ((cartTotal$ | async) ?? 0 >= 50 ? 0 : 5.99).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-300">
                    <span>Tax (19%)</span>
                    <span>€{{ (((cartTotal$ | async) ?? 0) * 0.19).toFixed(2) }}</span>
                  </div>
                </div>

                <div class="flex justify-between mb-6">
                  <span class="text-lg font-bold text-white">Total</span>
                  <span class="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    €{{ (((cartTotal$ | async) ?? 0) + (((cartTotal$ | async) ?? 0) * 0.19) + ((cartTotal$ | async) ?? 0 >= 50 ? 0 : 5.99)).toFixed(2) }}
                  </span>
                </div>

                <button
                  type="button"
                  routerLink="/shop/checkout"
                  class="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 px-4 rounded-lg font-semibold transition mb-3"
                >
                  Proceed to Checkout
                </button>

                <button
                  type="button"
                  (click)="clearCart()"
                  class="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 py-3 px-4 rounded-lg font-semibold transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class CartPageComponent {
  items$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  cartEmpty$: Observable<boolean>;

  constructor(private store: Store) {
    this.items$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectCartTotal);
    this.cartEmpty$ = this.store.select(selectCartEmpty);
  }

  increaseQuantity(productId: number, currentQuantity: number): void {
    this.store.dispatch(
      CartActions.updateQuantity({ productId, quantity: currentQuantity + 1 })
    );
  }

  decreaseQuantity(productId: number, currentQuantity: number): void {
    if (currentQuantity > 1) {
      this.store.dispatch(
        CartActions.updateQuantity({ productId, quantity: currentQuantity - 1 })
      );
    } else {
      this.removeItem(productId);
    }
  }

  removeItem(productId: number): void {
    this.store.dispatch(CartActions.removeItem({ productId }));
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.store.dispatch(CartActions.clearCart());
    }
  }
}
