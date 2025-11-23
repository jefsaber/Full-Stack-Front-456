import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartTotal,
  selectShippingCost,
  selectTotalWithShipping,
} from '../../state/cart/cart.selectors';
import { Observable } from 'rxjs';
import { CartItem } from '../../state/cart/cart.actions';
import { HttpClient } from '@angular/common/http';
import * as CartActions from '../../state/cart/cart.actions';

interface OrderConfirmation {
  order_number: string;
  status: string;
  total: number;
  delivery_date: string;
  tracking_url: string;
}

@Component({
  standalone: true,
  selector: 'app-checkout-confirm',
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
          <div class="flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-full font-bold">
            ✓
          </div>
          <div class="flex-1 h-1 bg-emerald-600 mx-4"></div>
        </div>
        <div class="flex items-center">
          <div class="flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-full font-bold">
            ✓
          </div>
        </div>
      </div>

      @if (orderConfirmation) {
        <!-- Success State -->
        <div class="text-center py-12">
          <p class="text-8xl mb-4">🎉</p>
          <h2 class="text-4xl font-bold text-white mb-2">Order Confirmed!</h2>
          <p class="text-gray-300 mb-6">Your order has been successfully placed</p>

          <!-- Order Details -->
          <div class="bg-emerald-600/10 border border-emerald-500/30 rounded-2xl p-8 mb-6">
            <div class="space-y-3">
              <div class="flex justify-between items-center border-b border-emerald-500/20 pb-3">
                <span class="text-gray-300">Order Number</span>
                <span class="font-bold text-emerald-400 text-xl">{{ orderConfirmation.order_number }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-emerald-500/20 pb-3">
                <span class="text-gray-300">Status</span>
                <span class="bg-emerald-600/30 text-emerald-300 px-3 py-1 rounded-full font-semibold">
                  {{ orderConfirmation.status | uppercase }}
                </span>
              </div>
              <div class="flex justify-between items-center border-b border-emerald-500/20 pb-3">
                <span class="text-gray-300">Total Amount</span>
                <span class="text-2xl font-bold text-emerald-400">€{{ orderConfirmation.total.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-300">Estimated Delivery</span>
                <span class="font-semibold text-white">{{ orderConfirmation.delivery_date | date: 'short' }}</span>
              </div>
            </div>
          </div>

          <!-- Items Summary -->
          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6 text-left">
            <h3 class="font-bold text-white mb-4">Order Items</h3>
            <div class="space-y-2">
              @for (item of items$ | async; track item.id) {
                <div class="flex justify-between text-gray-300">
                  <span>{{ item.name }} (x{{ item.quantity }})</span>
                  <span>€{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Next Steps -->
          <div class="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6 mb-6">
            <p class="text-gray-300 mb-3">Next steps:</p>
            <ul class="text-left text-sm text-gray-300 space-y-2">
              <li>✓ A confirmation email will be sent shortly</li>
              <li>✓ Track your package at: {{ orderConfirmation.tracking_url }}</li>
              <li>✓ Expected delivery in 2-3 business days</li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              type="button"
              routerLink="/shop/products"
              class="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 px-4 rounded-lg font-semibold transition"
            >
              Continue Shopping
            </button>
            <button
              type="button"
              routerLink="/shop/cart"
              class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-lg font-semibold transition"
            >
              View Cart
            </button>
          </div>
        </div>
      } @else {
        <!-- Order Review State -->
        <h2 class="text-2xl font-bold text-white mb-6">Review Your Order</h2>

        <!-- Order Summary -->
        <div class="grid grid-cols-2 gap-6 mb-6">
          <!-- Items -->
          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 class="font-bold text-white mb-4">Items</h3>
            <div class="space-y-3">
              @for (item of items$ | async; track item.id) {
                <div class="flex justify-between">
                  <span class="text-gray-300">{{ item.name }}</span>
                  <span class="text-white">{{ item.quantity }}x</span>
                </div>
              }
            </div>
          </div>

          <!-- Pricing -->
          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 class="font-bold text-white mb-4">Pricing</h3>
            <div class="space-y-2 text-gray-300">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>€{{ (cartTotal$ | async)?.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping</span>
                <span>€{{ (shippingCost$ | async)?.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Tax (19%)</span>
                <span>€{{ (((cartTotal$ | async) ?? 0) * 0.19).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between border-t border-white/10 pt-2 mt-2">
                <span class="font-bold text-white">TOTAL</span>
                <span class="text-xl font-bold text-emerald-400">
                  €{{ (totalWithShipping$ | async)?.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Terms -->
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" [(ngModel)]="termsAccepted" class="w-4 h-4" />
            <span class="text-gray-300 text-sm">
              I agree to the terms and conditions and privacy policy
            </span>
          </label>
        </div>

        <!-- Navigation -->
        <div class="flex gap-4">
          <button
            type="button"
            (click)="previousStep()"
            class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-lg font-semibold transition"
          >
            ← Back to Address
          </button>
          <button
            type="button"
            (click)="placeOrder()"
            [disabled]="!termsAccepted || placing"
            class="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition"
          >
            @if (placing) {
              ⏳ Placing Order...
            } @else {
              Place Order
            }
          </button>
        </div>
      }
    </div>
  `,
  styles: [],
})
export class CheckoutConfirmComponent implements OnInit {
  @Input() addressData: any;
  items$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  shippingCost$: Observable<number>;
  totalWithShipping$: Observable<number>;

  orderConfirmation: OrderConfirmation | null = null;
  termsAccepted = false;
  placing = false;

  constructor(
    private store: Store,
    private http: HttpClient
  ) {
    this.items$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectCartTotal);
    this.shippingCost$ = this.store.select(selectShippingCost);
    this.totalWithShipping$ = this.store.select(selectTotalWithShipping);
  }

  ngOnInit(): void {}

  previousStep(): void {
    // Will be handled by parent
  }

  placeOrder(): void {
    if (!this.termsAccepted) return;

    this.placing = true;

    this.totalWithShipping$.subscribe((total) => {
      const orderPayload = {
        items: (this.items$ as any).value,
        total,
        address: this.addressData,
      };

      this.http.post<OrderConfirmation>('/api/order/', orderPayload).subscribe({
        next: (confirmation) => {
          this.orderConfirmation = confirmation;
          this.placing = false;

          // Clear cart after successful order
          this.store.dispatch(CartActions.clearCart());
        },
        error: (err) => {
          console.error('Order placement error:', err);
          this.placing = false;
          alert('Failed to place order. Please try again.');
        },
      });
    }).unsubscribe();
  }
}
