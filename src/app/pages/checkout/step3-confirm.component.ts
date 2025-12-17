import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartBreakdown,
} from '../../state/cart/cart.selectors';
import { Observable, combineLatest, firstValueFrom } from 'rxjs';
import { CartItem, CartPromoResult } from '../../state/cart/cart.actions';
import * as CartActions from '../../state/cart/cart.actions';
import { OrdersStorageService } from '../../services/orders-storage.service';
import { OrderDetail } from '../../state/user/user.actions';
import * as UserActions from '../../state/user/user.actions';
import { take } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';

interface OrderConfirmation {
  order_number: string;
  status: string;
  total: number;
  delivery_date: string;
  tracking_url: string;
}

interface StockValidationResponse {
  valid: boolean;
  message?: string;
  summary?: Array<{ productId: number; productName: string; requested: number; available: number }>;
}

const EXPRESS_DELIVERY_FEE = 9.99;

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
            @if (confirmedItems.length > 0) {
              <div class="space-y-2">
                @for (item of confirmedItems; track item.productId) {
                  <div class="flex justify-between text-gray-300">
                    <span>{{ item.productName }} (x{{ item.quantity }})</span>
                    <span>€{{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                }
              </div>
            } @else {
              <p class="text-gray-500">No items were recorded for this order.</p>
            }
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
            <ng-container *ngIf="breakdown$ | async as breakdown">
              <div class="space-y-2 text-gray-300">
                <div class="flex justify-between">
                  <span>Sous-total</span>
                  <span>€{{ breakdown.itemsTotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Remise(s)</span>
                  <span class="text-emerald-400">-€{{ breakdown.discount.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Frais de port</span>
                  <span>€{{ breakdown.shipping.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Taxes</span>
                  <span>€{{ breakdown.taxes.toFixed(2) }}</span>
                </div>
                <div *ngIf="addressData?.deliveryOption === 'express'" class="flex justify-between text-gray-300">
                  <span>Express Delivery</span>
                  <span>€{{ expressDeliveryFee.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between border-t border-white/10 pt-2 mt-2">
                  <span class="font-bold text-white">TOTAL</span>
                  <span class="text-xl font-bold text-emerald-400">
                    €{{ (breakdown.grandTotal + (addressData?.deliveryOption === 'express' ? expressDeliveryFee : 0)).toFixed(2) }}
                  </span>
                </div>
              </div>
            </ng-container>
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
            (click)="handlePreviousStep()"
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
  @Output() previousStep = new EventEmitter<void>();
  @Input() addressData: any;
  items$: Observable<CartItem[]>;
  breakdown$: Observable<CartPromoResult>;

  orderConfirmation: OrderConfirmation | null = null;
  termsAccepted = false;
  placing = false;
  confirmedItems: OrderDetail['items'] = [];
  expressDeliveryFee = EXPRESS_DELIVERY_FEE;

  private readonly http = inject(HttpClient);
  private readonly notification = inject(NotificationService);

  constructor(
    private store: Store,
    private ordersStorage: OrdersStorageService
  ) {
    this.items$ = this.store.select(selectCartItems);
    this.breakdown$ = this.store.select(selectCartBreakdown);
  }

  ngOnInit(): void {}

  handlePreviousStep(): void {
    this.previousStep.emit();
  }

  async placeOrder(): Promise<void> {
    if (!this.termsAccepted) return;

    this.placing = true;

    try {
      // Get current cart items
      const items = await firstValueFrom(this.items$.pipe(take(1)));
      const breakdown = await firstValueFrom(this.breakdown$.pipe(take(1)));

      // Validate stock before placing order
      const stockPayload = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const stockResponse = await firstValueFrom(
        this.http.post<StockValidationResponse>('/api/cart/validate-stock/', stockPayload)
      );

      if (!stockResponse.valid) {
        this.notification.error('Stock insuffisant pour un ou plusieurs produits. Veuillez ajuster votre panier.');
        this.placing = false;
        return;
      }

      // Stock is valid, proceed with order
      const expressCharge = this.addressData?.deliveryOption === 'express' ? EXPRESS_DELIVERY_FEE : 0;
      const shippingWithExpress = breakdown.shipping + expressCharge;
      const totalWithExpress = breakdown.grandTotal + expressCharge;

      const orderData = {
        items,
        total: totalWithExpress,
        subtotal: breakdown.itemsTotal,
        tax: breakdown.taxes,
        shipping: shippingWithExpress,
        address: this.addressData,
        deliveryOption: this.addressData?.deliveryOption || 'standard',
      };

      const savedOrder = this.ordersStorage.addOrder(orderData);

      this.orderConfirmation = {
        order_number: `ORD-${savedOrder.id}`,
        status: 'confirmed',
        total: totalWithExpress,
        delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        tracking_url: savedOrder.trackingUrl || '',
      };
      this.confirmedItems = savedOrder.items || [];

      this.placing = false;

      this.notification.success('Commande confirmée ! Merci pour votre achat.');
      this.store.dispatch(CartActions.clearCart());
      this.store.dispatch(UserActions.addUserOrder({ order: savedOrder }));
      if (savedOrder.deliveryAddress) {
        this.store.dispatch(
          UserActions.setUserDefaultAddress({ address: savedOrder.deliveryAddress })
        );
      }
    } catch (error) {
      this.notification.error('Une erreur est survenue lors de la validation. Veuillez réessayer.');
      this.placing = false;
    }
  }
}
