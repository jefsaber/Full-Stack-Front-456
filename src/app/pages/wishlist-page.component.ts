import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as ProductsActions from '../state/products/products.actions';
import * as CartActions from '../state/cart/cart.actions';
import * as WishlistActions from '../state/wishlist/wishlist.actions';
import { selectCartItems } from '../state/cart/cart.selectors';
import { selectWishlistCount, selectWishlistProducts } from '../state/wishlist/wishlist.selectors';
import { selectIsAuthenticated } from '../state/auth/auth.selectors';
import * as AuthActions from '../state/auth/auth.actions';
import { CartIconComponent } from '../components/cart-icon/cart-icon.component';
import { WishlistIconComponent } from '../components/wishlist-icon/wishlist-icon.component';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  avgRating: number;
  stock: number;
  created_at: string;
  imageUrl?: string;
}

@Component({
  standalone: true,
  selector: 'app-wishlist-page',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    CartIconComponent,
    WishlistIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">🛍️</span>
              </div>
              <h1 class="text-2xl font-bold text-white">My Shop</h1>
            </div>

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

            <div class="flex items-center gap-4">
              <app-cart-icon></app-cart-icon>
              <app-wishlist-icon></app-wishlist-icon>

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

      <div class="px-6 py-12">
        <div class="mx-auto max-w-6xl relative space-y-8">
          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-white">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p class="text-sm tracking-wide uppercase text-pink-200">Liste d'envies</p>
                <h1 class="text-4xl font-bold">Your Wishlist</h1>
                <p class="text-gray-400 mt-1">Keep favorite products for easy checkout.</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{{ wishlistCount$ | async }}</p>
                <p class="text-sm text-gray-400">items saved</p>
              </div>
            </div>
          </div>

          @if ((wishlistProducts$ | async); as wishlistProducts) {
            @if (wishlistProducts.length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                @for (product of wishlistProducts; track product.id) {
                  <mat-card class="relative overflow-hidden border border-white/10 bg-transparent shadow-[0_35px_80px_-40px_rgba(15,23,42,0.9)]" style="background: transparent !important;">
                    <div class="relative z-10 p-6 space-y-5">
                      <div class="absolute inset-0 pointer-events-none border border-white/10 shadow-[inset_0_0_60px_rgba(255,255,255,0.05),0_10px_40px_-20px_rgba(15,23,42,0.8)]"></div>
                      <div>
                        <p class="text-sm text-pink-300 uppercase tracking-widest">Favorite</p>
                        <h3 class="text-2xl font-semibold text-white">{{ product.name }}</h3>
                        <p class="text-xs text-gray-400">Added on {{ product.created_at | date: 'mediumDate' }}</p>
                      </div>
                      <div class="flex flex-col gap-1">
                        <span class="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-sky-400 to-blue-500">€{{ product.price.toFixed(2) }}</span>
                        <p class="text-sm text-gray-300 leading-relaxed line-clamp-3">{{ product.description }}</p>
                        <div class="flex items-center gap-3 text-xs text-gray-300 font-semibold">
                          <span class="flex items-center gap-1 text-yellow-400">★ {{ product.avgRating }}/5</span>
                          <span class="text-slate-400">• Stock {{ product.stock }}</span>
                        </div>
                      </div>
                      <mat-card-actions class="flex flex-wrap gap-3 pt-0">
                        <button
                          type="button"
                          mat-raised-button
                          color="primary"
                          [routerLink]="['/shop/products', product.id]"
                          class="flex-1 bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20"
                        >
                          View Details
                        </button>
                        @if (isProductInCart(product.id) | async) {
                          <button
                            type="button"
                            mat-raised-button
                            color="warn"
                            disabled
                            class="text-white text-sm"
                          >
                            In Cart
                          </button>
                        } @else {
                          <button
                            type="button"
                            mat-raised-button
                            color="accent"
                            (click)="addToCart(product)"
                            class="text-white text-sm"
                          >
                            Add to Cart
                          </button>
                        }
                        <button
                          type="button"
                          mat-stroked-button
                          color="accent"
                          (click)="removeFromWishlist(product)"
                          class="border-pink-500 text-pink-200 hover:border-pink-400"
                        >
                          Remove
                        </button>
                      </mat-card-actions>
                    </div>
                  </mat-card>
                }
              </div>
            } @else {
              <div class="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">
                <p class="text-3xl">🤍 No favorites yet</p>
                <p>Browse products and save the ones you love.</p>
                <button
                  type="button"
                  mat-raised-button
                  color="primary"
                  routerLink="/shop/products"
                  class="bg-linear-to-r from-blue-600 to-purple-600"
                >
                  Browse Products
                </button>
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
export class WishlistPageComponent implements OnInit {
  wishlistProducts$: Observable<Product[]>;
  wishlistCount$: Observable<number>;
  cartItems$: Observable<any[]>;
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store, private snackBar: MatSnackBar) {
    this.wishlistProducts$ = this.store.select(selectWishlistProducts);
    this.wishlistCount$ = this.store.select(selectWishlistCount);
    this.cartItems$ = this.store.select(selectCartItems);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    this.store.dispatch(ProductsActions.loadProducts({ filters: {} }));
    this.store.dispatch(WishlistActions.loadWishlist());
  }

  addToCart(product: Product): void {
    const payload = {
      id: product.id,
      name: product.name,
      price: product.price,
      avgRating: product.avgRating,
    };
    this.store.dispatch(CartActions.addItem({ product: payload, quantity: 1 }));
    this.snackBar.open(`🛒 Added ${product.name} to cart`, 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
  }

  removeFromWishlist(product: Product): void {
    this.store.dispatch(WishlistActions.removeFromWishlist({ productId: product.id }));
    this.snackBar.open(`💔 Removed ${product.name} from wishlist`, 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
  }

  isProductInCart(productId: number): Observable<boolean> {
    return this.cartItems$.pipe(
      map((items) => items.some((item) => item.id === productId))
    );
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
