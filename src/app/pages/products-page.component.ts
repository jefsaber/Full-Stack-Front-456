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
  ],
  template: `
    <div class="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Products</h1>
        <button 
          type="button"
          routerLink="/app"
          mat-stroked-button
        >
          ← Back
        </button>
      </div>

      <!-- Filters Card -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Filters</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Page</mat-label>
              <input matInput type="number" min="0" formControlName="page" />
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
                <mat-option value="">None</mat-option>
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
              class="md:col-span-2"
            >
              Apply Filters
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Loading State -->
      @if (loading$ | async) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      }

      <!-- Error State -->
      @if (error$ | async; as error) {
        <mat-card class="border-2 border-red-200 bg-red-50">
          <mat-card-content>
            <p class="text-red-700 font-medium">{{ error }}</p>
          </mat-card-content>
        </mat-card>
      }

      <!-- Products Grid -->
      @if (products$ | async; as products) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (product of products; track product.id) {
            <mat-card class="hover:shadow-lg transition-shadow">
              <mat-card-header>
                <mat-card-title class="text-lg">{{ product.name }}</mat-card-title>
              </mat-card-header>
              <mat-card-content class="space-y-3">
                <p class="text-2xl font-bold text-indigo-600">\${{ product.price }}</p>
                <p class="text-sm text-gray-600">Created: {{ product.created_at | date: 'short' }}</p>
                <div class="flex items-center gap-2">
                  <span class="text-yellow-500 text-lg">★</span>
                  <span class="font-semibold">{{ product.avgRating }}/5</span>
                </div>
              </mat-card-content>
            </mat-card>
          } @empty {
            <div class="col-span-full text-center py-8">
              <p class="text-gray-600">No products found</p>
            </div>
          }
        </div>
      }
    </div>
  `,
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

    this.store.dispatch(ProductsActions.loadProducts({ filters }));
  }
}

