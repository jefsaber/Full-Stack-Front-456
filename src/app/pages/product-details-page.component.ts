import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as CartActions from '../state/cart/cart.actions';
import { selectCartItems } from '../state/cart/cart.selectors';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  avgRating: number;
  reviews_count: number;
  stock: number;
  created_at: string;
}

@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink, MatSnackBarModule],
  template: `
    <div class="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
      <!-- Background Gradient Blobs -->
      <div class="absolute -top-40 -left-40 w-80 h-80 bg-linear-to-br from-emerald-600/20 to-transparent rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-linear-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl"></div>

      <div class="mx-auto max-w-4xl relative z-10">
        <!-- Header -->
        <div class="sticky top-0 z-20 mb-8 bg-slate-900/80 backdrop-blur-md border-b border-white/10 -mx-6 px-6 py-4 rounded-b-2xl">
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-white">Product Details</h1>
            <button
              type="button"
              routerLink="/shop/products"
              class="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition"
            >
              ← Back
            </button>
          </div>
        </div>

        @if (loading) {
          <div class="text-center py-16">
            <p class="text-2xl text-gray-500">⏳ Loading...</p>
          </div>
        } @else if (error) {
          <div class="bg-red-500/10 border border-red-500/50 rounded-2xl p-6">
            <p class="text-red-400 font-medium">{{ error }}</p>
          </div>
        } @else if (product) {
          <!-- Product Content -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Image Placeholder -->
            <div class="bg-gradient-to-br from-emerald-600/30 to-cyan-600/30 backdrop-blur-md border border-white/10 rounded-2xl p-12 flex items-center justify-center h-96">
              <div class="text-center">
                <p class="text-8xl mb-4">📦</p>
                <p class="text-gray-300">Product Image</p>
              </div>
            </div>

            <!-- Product Info -->
            <div class="space-y-6">
              <!-- Name and Rating -->
              <div>
                <h2 class="text-4xl font-bold text-white mb-3">{{ product.name }}</h2>
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-1">
                    @for (star of [1, 2, 3, 4, 5]; track star) {
                      <span [class]="star <= product.avgRating ? 'text-yellow-400 text-lg' : 'text-white/20 text-lg'">
                        ★
                      </span>
                    }
                  </div>
                  <span class="text-gray-300">{{ product.avgRating }} ({{ product.reviews_count }} reviews)</span>
                </div>
              </div>

              <!-- Price -->
              <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <p class="text-gray-400 text-sm mb-2">Price</p>
                <p class="text-5xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  €{{ product.price.toFixed(2) }}
                </p>
              </div>

              <!-- Stock -->
              <div>
                <p class="text-gray-300 mb-2">
                  Availability:
                  <span [class]="product.stock > 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'">
                    {{ product.stock > 0 ? product.stock + ' in stock' : 'Out of stock' }}
                  </span>
                </p>
                <div class="w-full bg-white/10 rounded-full h-2">
                  <div
                    class="bg-linear-to-r from-emerald-600 to-cyan-600 h-2 rounded-full"
                    [style.width.%]="(product.stock / 50) * 100"
                  ></div>
                </div>
              </div>

              <!-- Description -->
              <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 class="text-lg font-bold text-white mb-3">Description</h3>
                <p class="text-gray-300 leading-relaxed">{{ product.description }}</p>
              </div>

              <!-- Quantity and Add to Cart -->
              <div class="flex gap-4">
                @if (!(isProductInCart() | async)) {
                  <div class="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                    <button
                      type="button"
                      (click)="decreaseQuantity()"
                      [disabled]="quantity <= 1"
                      class="text-white hover:text-emerald-400 transition font-bold disabled:opacity-50"
                    >
                      −
                    </button>
                    <span class="text-white font-semibold w-8 text-center">{{ quantity }}</span>
                    <button
                      type="button"
                      (click)="increaseQuantity()"
                      [disabled]="quantity >= product.stock"
                      class="text-white hover:text-emerald-400 transition font-bold disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    (click)="addToCart()"
                    [disabled]="product.stock <= 0"
                    class="flex-1 bg-linear-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition"
                  >
                    🛒 Add to Cart
                  </button>
                } @else {
                  <button
                    type="button"
                    (click)="removeFromCart()"
                    class="flex-1 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white py-3 px-6 rounded-lg font-semibold transition"
                  >
                    ✕ Remove from Cart
                  </button>
                }
              </div>

              <!-- Additional Info -->
              <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-sm text-gray-300">
                <p>✓ Free shipping on orders over €50</p>
                <p>✓ 30-day money-back guarantee</p>
                <p>✓ 2-3 business days delivery</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class ProductDetailsPageComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  quantity = 1;
  cartItems$: Observable<any[]>;
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private snackBar: MatSnackBar
  ) {
    this.cartItems$ = this.store.select(selectCartItems);
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap((params) => this.loadProduct(params['id'])),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  private loadProduct(id: string): void {
    this.loading = true;
    this.error = null;

    this.http
      .get<Product>(`/api/products/${id}/`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load product details';
          this.loading = false;
          console.error('Product load error:', err);
        },
      });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    const cartItem = {
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      avgRating: this.product.avgRating,
    };

    this.store.dispatch(
      CartActions.addItem({ product: cartItem, quantity: this.quantity })
    );

    this.snackBar.open(
      `✓ Added ${this.quantity} item${this.quantity > 1 ? 's' : ''} to cart`,
      'Close',
      { duration: 3000, panelClass: ['success-snackbar'] }
    );

    // Reset quantity
    this.quantity = 1;
  }

  isProductInCart(): Observable<boolean> {
    return new Observable((observer) => {
      this.cartItems$.subscribe((items) => {
        const isInCart = items.some((item) => item.id === this.product?.id);
        observer.next(isInCart);
      });
    });
  }

  removeFromCart(): void {
    if (!this.product) return;

    this.store.dispatch(CartActions.removeItem({ productId: this.product.id }));

    this.snackBar.open(
      `✓ Product removed from cart`,
      'Close',
      { duration: 2000, panelClass: ['success-snackbar'] }
    );
  }
}
