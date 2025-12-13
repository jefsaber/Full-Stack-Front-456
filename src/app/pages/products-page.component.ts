import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import * as ProductsActions from '../state/products/products.actions';
import * as CartActions from '../state/cart/cart.actions';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsCount,
} from '../state/products/products.selectors';
import { selectCartItems } from '../state/cart/cart.selectors';
import { selectIsAuthenticated } from '../state/auth/auth.selectors';
import * as AuthActions from '../state/auth/auth.actions';
import * as WishlistActions from '../state/wishlist/wishlist.actions';
import { selectIsProductInWishlist } from '../state/wishlist/wishlist.selectors';
import { Observable, Subject } from 'rxjs';
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';
import { CartIconComponent } from '../components/cart-icon/cart-icon.component';
import { WishlistIconComponent } from '../components/wishlist-icon/wishlist-icon.component';
import { takeUntil } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  avgRating: number;
  imageUrl?: string;
}

@Component({
  standalone: true,
  selector: 'app-products-page',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    SkeletonLoaderComponent,
    CartIconComponent,
    WishlistIconComponent,
  ],
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
              <!-- Cart + Wishlist Icons -->
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
        <div class="absolute -top-40 -left-40 w-80 h-80 bg-linear-to-br from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-linear-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
        <div class="mx-auto max-w-7xl relative z-10">
        <!-- Sticky Header -->
        <div class="sticky top-0 z-20 mb-8 bg-slate-900/80 backdrop-blur-md border-b border-white/10 -mx-6 px-6 py-4 rounded-b-2xl">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">Shop Products</h1>
              <p class="text-gray-400 text-sm">Discover our collection of quality items</p>
            </div>
            <button 
              type="button"
              routerLink="/app"
              class="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition"
            >
              ← Back
            </button>
          </div>
        </div>

        <!-- Filters Card -->
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span class="text-2xl">⚙️</span> Filters & Sorting
          </h2>
          <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white/10 rounded-lg border border-white/20 px-3 py-2">
              <label class="text-xs text-gray-300 block mb-1">Min Rating</label>
              <input type="number" min="0" max="5" step="0.1" formControlName="minRating" class="w-full bg-transparent text-white outline-none" />
            </div>

            <div class="bg-white/10 rounded-lg border border-white/20 px-3 py-2">
              <label class="text-xs text-gray-300 block mb-1">Sort By</label>
              <select formControlName="ordering" (change)="applyFilters()" class="w-full bg-transparent text-white outline-none">
                <option value="" class="bg-slate-800">Default</option>
                <option value="price" class="bg-slate-800">Price (Low to High)</option>
                <option value="-price" class="bg-slate-800">Price (High to Low)</option>
                <option value="name" class="bg-slate-800">Name (A-Z)</option>
              </select>
            </div>

            <button 
              type="button"
              (click)="applyFilters()"
              class="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
            >
              Apply Filters
            </button>
          </form>
        </div>

        <!-- Skeleton Loaders -->
        @if (loading$ | async) {
          <app-skeleton-loader 
            [count]="6"
            type="card">
          </app-skeleton-loader>
        }

        <!-- Error State -->
        @if (error$ | async; as error) {
          <div class="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 mb-8">
            <p class="text-red-400 font-medium flex items-center gap-2">
              <span class="text-2xl">⚠️</span>
              {{ error }}
            </p>
          </div>
        }

        <!-- Products Grid (Optimistic UI) -->
        @if ((products$ | async); as products) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            @for (product of products; track product.id) {
              <div class="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-blue-400/50 hover:shadow-2xl transition-all duration-300 animate-fadeIn">
                <div class="p-6 space-y-4">
                  <h3 class="text-lg font-bold text-white group-hover:text-blue-300 transition">{{ product.name }}</h3>
                  <div class="flex justify-between items-center">
                    <span class="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">€{{ product.price }}</span>
                    <div class="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                      <span class="text-yellow-400">★</span>
                      <span class="font-semibold text-sm text-yellow-300">{{ product.avgRating }}</span>
                    </div>
                  </div>
                  <p class="text-sm text-gray-400">Created: {{ product.created_at | date: 'short' }}</p>

                  <!-- Action Buttons -->
                  <div class="flex gap-2 pt-4">
                    <button
                      type="button"
                      [routerLink]="['/shop/products', product.id]"
                      class="flex-1 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 py-2 px-3 rounded-lg font-semibold transition text-sm"
                    >
                      View Details
                    </button>
                    @if (isProductInCart(product.id) | async) {
                      <button
                        type="button"
                        (click)="removeFromCart(product.id)"
                        class="flex-1 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white py-2 px-3 rounded-lg font-semibold transition text-sm"
                      >
                        ✕ Remove
                      </button>
                    } @else {
                      <button
                        type="button"
                        (click)="addToCart(product)"
                        class="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-2 px-3 rounded-lg font-semibold transition text-sm"
                      >
                        🛒 Add
                      </button>
                    }
                  </div>
                  <div class="pt-2">
                    @if (isProductInWishlist(product.id) | async) {
                      <button
                        type="button"
                        (click)="removeFromWishlist(product.id)"
                        class="w-full bg-linear-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white py-2 px-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                      >
                        💖 Already in wishlist
                      </button>
                    } @else {
                      <button
                        type="button"
                        (click)="addToWishlist(product.id)"
                        class="w-full bg-white/10 border border-pink-500/30 hover:border-pink-400 hover:bg-pink-500/10 text-pink-200 py-2 px-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                      >
                        🤍 Save for later
                      </button>
                    }
                  </div>
                </div>
              </div>
            } @empty {
              <div class="col-span-full text-center py-16">
                <p class="text-2xl text-gray-500">📦</p>
                <p class="text-gray-400 text-lg mt-2">No products found</p>
              </div>
            }
          </div>

          <!-- Pagination -->
          <div class="mt-6 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              (click)="setPage(currentPage - 1)"
              [disabled]="currentPage === 0"
              class="pagination-button"
            >
              ← Prev
            </button>
            <ng-container *ngFor="let page of pageRange; trackBy: trackByPage">
              <button
                type="button"
                (click)="setPage(page)"
                [class.active]="page === currentPage"
                class="pagination-button"
              >
                {{ page + 1 }}
              </button>
            </ng-container>
            <button
              type="button"
              (click)="setPage(currentPage + 1)"
              [disabled]="currentPage >= totalPages - 1"
              class="pagination-button"
            >
              Next →
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-button {
      text-transform: none !important;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    ::ng-deep .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }

    .pagination-button {
      border: 1px solid rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.08);
      padding: 0.5rem 1rem;
      border-radius: 999px;
      color: #f8fafc;
      font-size: 0.9rem;
      font-weight: 600;
      transition: transform 0.2s, background 0.2s;
    }

    .pagination-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.18);
      transform: translateY(-1px);
    }

    .pagination-button.active {
      border-color: transparent;
      background: linear-gradient(135deg, #34d399, #06b6d4);
      color: #111827;
    }

    .pagination-button:disabled {
      opacity: 0.4;
    }
  `],
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  cartItems$: Observable<any[]>;
  isAuthenticated$: any;
  
  pageSize = 6;
  currentPage = 0;
  totalProducts = 0;
  totalPages = 0;
  pageRange: number[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      minRating: [0],
      ordering: [''],
    });

    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.error$ = this.store.select(selectProductsError);
    this.cartItems$ = this.store.select(selectCartItems);
  }

  trackByPage(_index: number, page: number): number {
    return page;
  }

  ngOnInit(): void {
    this.store
      .select(selectProductsCount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((count) => {
        this.totalProducts = count;
        this.totalPages = Math.max(1, Math.ceil(count / this.pageSize));
        if (this.currentPage >= this.totalPages) {
          this.currentPage = this.totalPages - 1;
        }
        this.updatePageRange();
      });

    this.applyFilters();
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  applyFilters(): void {
    this.currentPage = 0; // Reset to first page when filters change
    this.updatePageRange();
    this.fetchProducts();
  }

  setPage(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.totalPages || pageIndex === this.currentPage) {
      return;
    }

    this.currentPage = pageIndex;
    this.updatePageRange();
    this.fetchProducts();
  }

  private fetchProducts(): void {
    const filters = {
      page: this.currentPage + 1,
      pageSize: this.pageSize,
      minRating: this.filterForm.get('minRating')?.value || 0,
      ordering: this.filterForm.get('ordering')?.value || '',
    };

    this.store.dispatch(ProductsActions.loadProducts({ filters }));
  }

  private updatePageRange(): void {
    const maxVisible = 5;
    const totalPages = Math.max(1, this.totalPages);
    let start = Math.max(0, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    if (end - start + 1 < maxVisible && totalPages >= maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    this.pageRange = [];
    for (let i = start; i <= end; i += 1) {
      this.pageRange.push(i);
    }
  }

  isProductInCart(productId: number): Observable<boolean> {
    return new Observable((observer) => {
      this.cartItems$.subscribe((items) => {
        const isInCart = items.some((item) => item.id === productId);
        observer.next(isInCart);
      });
    });
  }

  isProductInWishlist(productId: number): Observable<boolean> {
    return this.store.select(selectIsProductInWishlist(productId));
  }

  addToCart(product: Product): void {
    this.store.dispatch(
      CartActions.addItem({ product: { ...product }, quantity: 1 })
    );

    this.snackBar.open(
      `✓ ${product.name} added to cart`,
      'Close',
      { duration: 2000, panelClass: ['success-snackbar'] }
    );
  }

  removeFromCart(productId: number): void {
    this.store.dispatch(CartActions.removeItem({ productId }));

    this.snackBar.open(
      `✓ Product removed from cart`,
      'Close',
      { duration: 2000, panelClass: ['success-snackbar'] }
    );
  }

  addToWishlist(productId: number): void {
    this.store.dispatch(WishlistActions.addToWishlist({ productId }));
    this.snackBar.open(`💖 Product saved to wishlist`, 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
  }

  removeFromWishlist(productId: number): void {
    this.store.dispatch(WishlistActions.removeFromWishlist({ productId }));
    this.snackBar.open(`💔 Product removed from wishlist`, 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

