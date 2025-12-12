import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as CartActions from '../state/cart/cart.actions';
import { selectCartItems } from '../state/cart/cart.selectors';
import * as ProductsActions from '../state/products/products.actions';
import { selectAllProducts } from '../state/products/products.selectors';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, tap, map, shareReplay, switchMap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { selectIsAuthenticated } from '../state/auth/auth.selectors';
import * as AuthActions from '../state/auth/auth.actions';
import { CartIconComponent } from '../components/cart-icon/cart-icon.component';

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
  imports: [CommonModule, RouterLink, MatSnackBarModule, MatButtonModule, MatIconModule, CartIconComponent],
  template: `
    <div class="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <!-- Navbar -->
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4">
          <div class="flex justify-between items-center">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">🛍️</span>
              </div>
              <h1 class="text-2xl font-bold text-white">My Shop</h1>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center gap-6">
              <button 
                type="button"
                mat-button
                routerLink="/"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Home
              </button>
              <button 
                type="button"
                mat-button
                routerLink="/shop/products"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Products
              </button>
              <button 
                type="button"
                mat-button
                routerLink="/shop/rating"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Ratings
              </button>
              <button 
                type="button"
                mat-button
                *ngIf="isAuthenticated$ | async"
                routerLink="/account/profile"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Mon Compte
              </button>
              <button 
                type="button"
                mat-button
                routerLink="/dev"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Dev
              </button>
            </div>
          
            <!-- Auth Section -->
            <div class="flex items-center gap-4">
              <!-- Cart Icon -->
              <app-cart-icon></app-cart-icon>

              @if (isAuthenticated$ | async) {
                <div class="flex items-center gap-3 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span class="text-green-200 font-medium text-sm">Authenticated</span>
                </div>
                <button
                  type="button"
                  mat-button
                  (click)="logout()"
                  class="text-red-300 hover:text-red-100 transition"
                >
                  Logout
                </button>
              } @else {
                <button
                  type="button"
                  mat-raised-button
                  routerLink="/login"
                  class="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Sign In
                </button>
              }
            </div>
          </div>
        </div>
      </nav>

      <div class="p-6 relative overflow-hidden">
        <!-- Background Gradient Blobs -->
        <div class="absolute -top-40 -left-40 w-80 h-80 bg-linear-to-br from-emerald-600/20 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-linear-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl"></div>

        <div class="max-w-4xl mx-auto">
          <!-- Product Content -->
          @if (loading) {
            <div class="text-center py-16">
              <p class="text-2xl text-gray-500">⏳ Loading...</p>
            </div>
          } @else if (error) {
            <div class="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 backdrop-blur-md">
              <div class="flex items-start gap-4">
                <div class="text-4xl">⚠️</div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-red-200 mb-2">Unable to Load Product</h3>
                  <p class="text-red-300 mb-4">{{ error }}</p>
                  <p class="text-sm text-red-300/70 mb-4">The product you're looking for could not be found. Please check the product ID and try again.</p>
                  <button
                    type="button"
                    routerLink="/shop/products"
                    class="inline-flex items-center gap-2 bg-red-600/50 hover:bg-red-600/70 border border-red-500/50 text-white px-4 py-2 rounded-lg transition"
                  >
                    ← Back to Products
                  </button>
                </div>
              </div>
            </div>
          } @else {
            @let product = (product$ | async);
            @if (product) {
          <!-- Product Content -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Image Placeholder -->
            <div class="bg-linear-to-br from-emerald-600/30 to-cyan-600/30 backdrop-blur-md border border-white/10 rounded-2xl p-12 flex items-center justify-center h-96">
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
                    <span
                      class="w-8 text-center text-white font-semibold"
                      aria-live="polite"
                      >
                      {{ quantity }}
                    </span>
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
                    (click)="addToCart(product)"
                    [disabled]="product.stock <= 0"
                    class="flex-1 bg-linear-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition"
                  >
                    🛒 Add to Cart
                  </button>
                } @else {
                  <button
                    type="button"
                    (click)="removeFromCart(product)"
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
export class ProductDetailsPageComponent implements OnInit, OnDestroy {
  product$!: Observable<Product | null>;
  currentProduct: Product | null = null;
  loading = false;
  error: string | null = null;
  quantity = 1;
  cartItems$: Observable<any[]>;
  isAuthenticated$: any;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private snackBar: MatSnackBar
  ) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    // Load products to store
    this.store.dispatch(ProductsActions.loadProducts({ filters: {} }));

    // Get the product from store based on route ID
    this.product$ = this.route.params.pipe(
      tap(() => {
        this.quantity = 1; // Reset quantity when route changes
        this.error = null;
      }),
      map((params) => Number(params['id'])),
      switchMap((productId) => 
        this.store.select(selectAllProducts).pipe(
          map((products) => {
            const found = products.find((p: any) => p.id === productId) || null;
            if (!found && products.length > 0) {
              this.error = 'Product not found. The product ID may be invalid.';
            }
            this.currentProduct = found as Product | null;
            return found as Product | null;
          })
        )
      ),
      takeUntil(this.destroy$),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  increaseQuantity(): void {
    if (this.quantity < (this.currentProduct?.stock || 0)) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: Product): void {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      avgRating: product.avgRating,
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
    return combineLatest([this.product$, this.cartItems$]).pipe(
      map(([product, items]) => {
        if (!product || !items) return false;
        return items.some((item) => item.id === product.id);
      })
    );
  }

  removeFromCart(product: Product): void {
    this.store.dispatch(CartActions.removeItem({ productId: product.id }));

    this.snackBar.open(
      `✓ Product removed from cart`,
      'Close',
      { duration: 2000, panelClass: ['success-snackbar'] }
    );
  }
}
