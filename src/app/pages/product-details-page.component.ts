import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as CartActions from '../state/cart/cart.actions';
import { selectCartItems } from '../state/cart/cart.selectors';
import * as ProductsActions from '../state/products/products.actions';
import { selectAllProducts } from '../state/products/products.selectors';
import { selectIsAuthenticated } from '../state/auth/auth.selectors';
import * as AuthActions from '../state/auth/auth.actions';
import * as WishlistActions from '../state/wishlist/wishlist.actions';
import { selectIsProductInWishlist } from '../state/wishlist/wishlist.selectors';
import * as ReviewsActions from '../state/reviews/reviews.actions';
import {
  selectReviewAverage,
  selectReviewCount,
  selectReviewError,
  selectReviewList,
  selectReviewLoading,
  selectReviewPostError,
  selectReviewPosting,
} from '../state/reviews/reviews.selectors';
import { Review, ReviewsFetchOptions } from '../state/reviews/review.model';
import { selectUserFullName } from '../state/user/user.selectors';
import { CartIconComponent } from '../components/cart-icon/cart-icon.component';
import { WishlistIconComponent } from '../components/wishlist-icon/wishlist-icon.component';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, tap, map, shareReplay, switchMap, distinctUntilChanged, filter } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  avgRating: number;
  reviews_count: number;
  stock: number;
  lowStockThreshold: number;
  created_at: string;
}

@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink, MatSnackBarModule, MatButtonModule, MatIconModule, ReactiveFormsModule, CartIconComponent, WishlistIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
                *ngIf="isAuthenticated$ | async"
                routerLink="/admin/dashboard"
                class="text-gray-200 hover:text-white transition font-medium"
              >
                Admin
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
                @let stockStatus = getStockStatus(product);
                <p class="text-gray-300 mb-2">
                  Disponibilité:
                  <span [class]="stockStatus.class">
                    {{ stockStatus.message }}
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

              <div class="pt-4">
                @if (isProductInWishlist(product.id) | async) {
                  <button
                    type="button"
                    (click)="removeFromWishlist(product)"
                    class="w-full bg-linear-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white py-3 px-4 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    💖 Remove from wishlist
                  </button>
                } @else {
                  <button
                    type="button"
                    (click)="addToWishlist(product)"
                    class="w-full bg-white/10 border border-pink-500/30 hover:border-pink-400 hover:bg-pink-500/10 text-pink-200 py-3 px-4 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    🤍 Save for later
                  </button>
                }
              </div>

              <!-- Additional Info -->
              <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-sm text-gray-300">
                <p>✓ Free shipping on orders over €50</p>
                <p>✓ 30-day money-back guarantee</p>
                <p>✓ 2-3 business days delivery</p>
              </div>

              <!-- Reviews Section -->
              <div class="space-y-5 mt-6">
                <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div class="flex flex-wrap justify-between gap-4">
                    <div>
                      <p class="text-sm uppercase tracking-wide text-gray-400 mb-1">Avis clients</p>
                      <div class="flex items-end gap-3">
                        <span class="text-4xl font-semibold text-white">
                          {{ ((reviewAverage$ | async) || product?.avgRating || 0) | number:'1.1-1' }}
                        </span>
                        <span class="text-sm text-gray-300">
                          ({{ (reviewCount$ | async) || product?.reviews_count || 0 }} avis)
                        </span>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-3 text-sm">
                      <div>
                        <label class="sr-only">Filtrer les avis</label>
                        <select
                          [value]="reviewFilterRating"
                          (change)="handleRatingFilterChange($event)"
                          class="review-select w-full min-w-[160px] border text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="all">Toutes les notes</option>
                          <option value="5">5 étoiles uniquement</option>
                          <option value="4">4 étoiles et plus</option>
                        </select>
                      </div>
                      <div>
                        <label class="sr-only">Trier les avis</label>
                        <select
                          [value]="reviewSortBy"
                          (change)="handleSortChange($event)"
                          class="review-select w-full min-w-[160px] border text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="recent">Les plus récents</option>
                          <option value="rating">Les mieux notés</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <p
                    *ngIf="reviewsError$ | async as reviewsError"
                    class="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3 mt-4"
                  >
                    {{ reviewsError }}
                  </p>

                  <div class="mt-4 space-y-4">
                    <ng-container *ngIf="reviewsLoading$ | async; else reviewsLoaded">
                      <div class="py-8 text-center text-gray-400">Chargement des avis…</div>
                    </ng-container>

                    <ng-template #reviewsLoaded>
                      <ng-container *ngIf="reviews$ | async as reviewsList">
                        <div *ngIf="reviewsList.length; else noReviews" class="space-y-4">
                          <article
                            *ngFor="let review of reviewsList; trackBy: trackByReview"
                            class="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2"
                          >
                            <div class="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-300">
                              <div class="flex items-center gap-2">
                                <span class="flex items-center gap-0.5 text-yellow-300">
                                  <ng-container *ngFor="let star of [1, 2, 3, 4, 5]; trackBy: trackByNumber">
                                    <span [class]="star <= review.rating ? 'text-yellow-400 text-base' : 'text-white/20 text-base'">★</span>
                                  </ng-container>
                                </span>
                                <span>{{ review.author }}</span>
                              </div>
                              <span>{{ review.createdAt | date:'mediumDate' }}</span>
                            </div>
                            <p class="text-sm text-gray-300 leading-relaxed">{{ review.comment }}</p>
                          </article>
                        </div>
                      </ng-container>
                    </ng-template>

                    <ng-template #noReviews>
                      <div class="py-6 text-center text-sm text-gray-400 border border-dashed border-white/20 rounded-2xl">
                        Aucun avis pour le moment.
                      </div>
                    </ng-template>
                  </div>
                </div>

                <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div class="flex items-center justify-between flex-wrap gap-3">
                    <h3 class="text-lg font-semibold text-white">Laisser un avis</h3>
                    <p class="text-sm text-gray-400">
                      {{ (isAuthenticated$ | async) ? 'Merci de partager votre experience.' : 'Connectez-vous pour ecrire un avis.' }}
                    </p>
                  </div>

                  <ng-container *ngIf="isAuthenticated$ | async; else reviewLoginPrompt">
                    <form [formGroup]="reviewForm" (ngSubmit)="submitReview()" class="mt-4 space-y-4">
                      <div>
                        <label class="text-sm font-medium text-gray-300">Note</label>
                        <select
                          formControlName="rating"
                          class="review-select w-full mt-2 border text-white px-3 py-2 rounded-lg text-sm"
                        >
                          <option *ngFor="let value of [5, 4, 3, 2, 1]; trackBy: trackByNumber" [value]="value">{{ value }} étoiles</option>
                        </select>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-gray-300">Commentaire</label>
                        <textarea
                          formControlName="comment"
                          rows="3"
                          class="w-full mt-2 bg-white/5 border border-white/20 text-white px-3 py-2 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Racontez ce qui vous a plu..."
                        ></textarea>
                        <p
                          *ngIf="reviewForm.controls['comment'].invalid && reviewForm.controls['comment'].touched"
                          class="text-xs text-rose-300 mt-1"
                        >
                          {{ reviewForm.controls['comment'].errors?.['required']
                            ? 'Le commentaire est requis.'
                            : 'Le commentaire doit compter au moins 5 characters.' }}
                        </p>
                      </div>
                      <div class="text-right">
                        <button
                          type="submit"
                          mat-raised-button
                          class="review-submit-btn bg-emerald-600 hover:bg-emerald-500 text-white w-full sm:w-auto"
                          [disabled]="reviewForm.invalid || (reviewPosting$ | async)"
                        >
                          {{ (reviewPosting$ | async) ? 'Envoi en cours…' : 'Publier mon avis' }}
                        </button>
                      </div>
                    </form>
                    <p *ngIf="reviewPostError$ | async as postError" class="text-xs text-rose-300 mt-2">
                      {{ postError }}
                    </p>
                  </ng-container>

                  <ng-template #reviewLoginPrompt>
                    <div class="mt-4 text-sm text-gray-400">
                      Les avis sont reserves aux membres connectes.
                    </div>
                  </ng-template>
                </div>
              </div>
            </div>
          </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    :host ::ng-deep .mat-mdc-button {
      text-transform: none !important;
    }

    .review-select {
      background-color: rgba(15, 23, 42, 0.75);
      border-color: rgba(255, 255, 255, 0.35);
      color: #f8fafc;
      transition: border-color 120ms ease, box-shadow 120ms ease;
    }

    .review-select:focus-visible {
      border-color: #34d399;
      box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.35);
      outline: none;
    }

    .review-select option {
      background-color: #0f172a;
      color: #e2e8f0;
    }

    .review-select:disabled {
      background-color: rgba(15, 23, 42, 0.4);
      color: rgba(255, 255, 255, 0.6);
      cursor: not-allowed;
    }

    .review-submit-btn:disabled {
      background: linear-gradient(180deg, #1f2937, #111827);
      color: rgba(243, 244, 246, 0.7);
      box-shadow: none;
    }

    :host ::ng-deep .review-submit-btn.mat-mdc-button:disabled {
      border-color: transparent;
    }
    `,
  ]
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
  reviewForm: FormGroup;
  reviews$: Observable<Review[]>;
  reviewsLoading$: Observable<boolean>;
  reviewsError$: Observable<string | null>;
  reviewAverage$: Observable<number>;
  reviewCount$: Observable<number>;
  reviewPosting$: Observable<boolean>;
  reviewPostError$: Observable<string | null>;
  reviewerName = 'Client';
  reviewFilterRating: 'all' | '5' | '4' = 'all';
  reviewSortBy: 'recent' | 'rating' = 'recent';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private actions$: Actions
  ) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.reviews$ = this.store.select(selectReviewList);
    this.reviewsLoading$ = this.store.select(selectReviewLoading);
    this.reviewsError$ = this.store.select(selectReviewError);
    this.reviewAverage$ = this.store.select(selectReviewAverage);
    this.reviewCount$ = this.store.select(selectReviewCount);
    this.reviewPosting$ = this.store.select(selectReviewPosting);
    this.reviewPostError$ = this.store.select(selectReviewPostError);

    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
    });

    this.actions$
      .pipe(ofType(ReviewsActions.postReviewSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.reviewForm.markAsPristine();
      });

    this.store
      .select(selectUserFullName)
      .pipe(takeUntil(this.destroy$))
      .subscribe((name) => {
        this.reviewerName = name || 'Client';
      });
  }

  ngOnInit(): void {
    // Load products to store
    this.store.dispatch(ProductsActions.loadProducts({ filters: {} }));

    this.route.params
      .pipe(
        map((params) => Number(params['id'])),
        distinctUntilChanged(),
        tap((productId) => {
          if (!Number.isFinite(productId)) {
            return;
          }
          this.dispatchReviewLoad(productId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

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

    this.product$
      .pipe(
        filter((product): product is Product => !!product),
        map((product) => product.id),
        distinctUntilChanged(),
        tap((productId) => this.dispatchReviewLoad(productId)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  private dispatchReviewLoad(productId: number): void {
    this.store.dispatch(
      ReviewsActions.loadReviews({ productId, filters: this.buildReviewFilters() })
    );
  }

  private buildReviewFilters(): ReviewsFetchOptions {
    const filters: ReviewsFetchOptions = { sortBy: this.reviewSortBy };

    if (this.reviewFilterRating === '5') {
      filters.minRating = 5;
    } else if (this.reviewFilterRating === '4') {
      filters.minRating = 4;
    }

    return filters;
  }

  private reloadReviews(): void {
    if (!this.currentProduct?.id) {
      return;
    }

    this.dispatchReviewLoad(this.currentProduct.id);
  }

  onReviewRatingFilterChange(value: 'all' | '4' | '5'): void {
    this.reviewFilterRating = value;
    this.reloadReviews();
  }

  onReviewSortChange(value: 'recent' | 'rating'): void {
    this.reviewSortBy = value;
    this.reloadReviews();
  }

  handleRatingFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement | null)?.value;
    if (!value) {
      return;
    }
    this.onReviewRatingFilterChange(value as 'all' | '4' | '5');
  }

  handleSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement | null)?.value;
    if (!value) {
      return;
    }
    this.onReviewSortChange(value as 'recent' | 'rating');
  }

  getStockStatus(product: Product): { message: string; class: string } {
    if (product.stock === 0) {
      return { message: 'Rupture de stock', class: 'text-red-400 font-bold' };
    }

    if (product.stock <= product.lowStockThreshold) {
      return {
        message: `Plus que ${product.stock} en stock`,
        class: 'text-amber-300 font-semibold',
      };
    }

    return { message: 'En stock', class: 'text-emerald-400 font-bold' };
  }

  submitReview(): void {
    if (!this.currentProduct) {
      return;
    }

    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const ratingControl = this.reviewForm.get('rating');
    const commentControl = this.reviewForm.get('comment');
    if (!ratingControl || !commentControl) {
      return;
    }

    const rating = ratingControl.value as number;
    const comment = commentControl.value as string;

    this.store.dispatch(
      ReviewsActions.postReview({
        productId: this.currentProduct.id,
        rating,
        comment,
        author: this.reviewerName || 'Client',
      })
    );
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

  trackByReview(_index: number, review: Review): number {
    return review.id;
  }

  trackByNumber(_index: number, value: number): number {
    return value;
  }

  isProductInCart(): Observable<boolean> {
    return combineLatest([this.product$, this.cartItems$]).pipe(
      map(([product, items]) => {
        if (!product || !items) return false;
        return items.some((item) => item.id === product.id);
      })
    );
  }

  isProductInWishlist(productId: number): Observable<boolean> {
    return this.store.select(selectIsProductInWishlist(productId));
  }

  removeFromCart(product: Product): void {
    this.store.dispatch(CartActions.removeItem({ productId: product.id }));

    this.snackBar.open(
      `✓ Product removed from cart`,
      'Close',
      { duration: 2000, panelClass: ['success-snackbar'] }
    );
  }

  addToWishlist(product: Product): void {
    this.store.dispatch(WishlistActions.addToWishlist({ productId: product.id }));
    this.snackBar.open(`💖 Saved ${product.name} to wishlist`, 'Close', {
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
}
