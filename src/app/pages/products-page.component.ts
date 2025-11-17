import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import * as ProductsActions from '../state/products/products.actions';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from '../state/products/products.selectors';
import { Observable } from 'rxjs';
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';

export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  avgRating: number;
}

@Component({
  standalone: true,
  selector: 'app-products-page',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SkeletonLoaderComponent,
  ],
  template: `
    <div class="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6">
      <div class="mx-auto max-w-7xl">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-4xl font-bold text-slate-900 mb-2">Shop Products</h1>
            <p class="text-slate-600">Discover our collection of quality items</p>
          </div>
          <button 
            type="button"
            routerLink="/app"
            mat-raised-button
            class="bg-slate-900 text-white hover:bg-slate-800"
          >
            ← Back
          </button>
        </div>

        <!-- Filters Card -->
        <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span class="text-2xl">⚙️</span> Filters & Sorting
          </h2>
          <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Page</mat-label>
              <input matInput type="number" min="1" formControlName="page" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Page Size</mat-label>
              <input matInput type="number" min="1" formControlName="pageSize" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Min Rating</mat-label>
              <input matInput type="number" min="0" max="5" step="0.1" formControlName="minRating" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Sort By</mat-label>
              <mat-select formControlName="ordering">
                <mat-option value="">Default</mat-option>
                <mat-option value="price">Price (Low to High)</mat-option>
                <mat-option value="-price">Price (High to Low)</mat-option>
                <mat-option value="name">Name (A-Z)</mat-option>
              </mat-select>
            </mat-form-field>

            <button 
              type="submit"
              mat-raised-button 
              color="primary"
              (click)="applyFilters()"
              class="lg:col-span-1 bg-purple-600 text-white hover:bg-purple-700"
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
          <div class="bg-red-50 border border-red-500/50 rounded-2xl p-6 mb-8">
            <p class="text-red-600 font-medium flex items-center gap-2">
              <span class="text-2xl">⚠️</span>
              {{ error }}
            </p>
          </div>
        }

        <!-- Products Grid (Optimistic UI) -->
        @if ((products$ | async); as products) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (product of products; track product.id) {
              <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-purple-400 transition-all duration-300 animate-fadeIn">
                <div class="p-6 space-y-4">
                  <h3 class="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition">{{ product.name }}</h3>
                  <div class="flex justify-between items-center">
                    <span class="text-3xl font-bold text-purple-600">€{{ product.price }}</span>
                    <div class="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                      <span class="text-yellow-500">★</span>
                      <span class="font-semibold text-sm text-slate-900">{{ product.avgRating }}</span>
                    </div>
                  </div>
                  <p class="text-sm text-slate-500">Created: {{ product.created_at | date: 'short' }}</p>
                </div>
              </div>
            } @empty {
              <div class="col-span-full text-center py-16">
                <p class="text-2xl text-slate-400">📦</p>
                <p class="text-slate-600 text-lg mt-2">No products found</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
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
  `],
})
export class ProductsPageComponent implements OnInit {
  filterForm: FormGroup;
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.filterForm = this.fb.group({
      page: [0],
      pageSize: [6],
      minRating: [0],
      ordering: [''],
    });

    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const filters = {
      page: this.filterForm.get('page')?.value || 0,
      pageSize: this.filterForm.get('pageSize')?.value || 6,
      minRating: this.filterForm.get('minRating')?.value || 0,
      ordering: this.filterForm.get('ordering')?.value || '',
    };

    // Optimistic UI: Dispatch action immediately
    // The effects will update the store with actual data
    this.store.dispatch(ProductsActions.loadProducts({ filters }));
  }
}

