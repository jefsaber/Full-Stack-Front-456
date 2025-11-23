import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartCount } from '../../state/cart/cart.selectors';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-cart-icon',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative">
      <a
        routerLink="/shop/cart"
        class="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-lg transition"
      >
        <span class="text-xl">🛒</span>
        @if ((cartCount$ | async); as count) {
          @if (count > 0) {
            <span class="text-sm font-semibold text-white">{{ count }}</span>
            <span
              class="absolute -top-2 -right-2 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
            >
              {{ count }}
            </span>
          } @else {
            <span class="text-sm font-semibold text-gray-400">Empty</span>
          }
        }
      </a>
    </div>
  `,
  styles: [],
})
export class CartIconComponent {
  cartCount$: Observable<number>;

  constructor(private store: Store) {
    this.cartCount$ = this.store.select(selectCartCount);
  }
}
