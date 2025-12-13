import { Injectable } from '@angular/core';
import { ProductsFilters, ProductsResponse } from './products.actions';

interface CacheEntry {
  filtersKey: string;
  data: ProductsResponse;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsCacheService {
  private readonly cache = new Map<string, CacheEntry>();

  buildKey(filters?: ProductsFilters): string {
    return JSON.stringify(filters ?? {});
  }

  get(filtersKey: string): CacheEntry | undefined {
    return this.cache.get(filtersKey);
  }

  set(filtersKey: string, data: ProductsResponse): void {
    this.cache.set(filtersKey, {
      filtersKey,
      data,
      timestamp: Date.now(),
    });
  }

  hasChanged(filtersKey: string, data: ProductsResponse): boolean {
    const existing = this.get(filtersKey);
    if (!existing) {
      return true;
    }
    if (existing.data.count !== data.count) {
      return true;
    }
    const existingIds = existing.data.results.map((p) => p.id);
    const incomingIds = data.results.map((p) => p.id);
    if (existingIds.length !== incomingIds.length) {
      return true;
    }
    for (let i = 0; i < existingIds.length; i += 1) {
      if (existingIds[i] !== incomingIds[i]) {
        return true;
      }
    }
    return false;
  }
}
