import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectWishlistCount } from '../../state/wishlist/wishlist.selectors';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-wishlist-icon',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative">
      <a
        routerLink="/account/wishlist"
        class="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-lg transition"
      >
        <span class="text-xl">💖</span>
        @if ((wishlistCount$ | async); as count) {
          @if (count > 0) {
            <span class="text-sm font-semibold text-white">My Wishlist</span>
            <span
              class="absolute -top-2 -right-2 bg-linear-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
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
})
export class WishlistIconComponent {
  wishlistCount$: Observable<number>;

  constructor(private store: Store) {
    this.wishlistCount$ = this.store.select(selectWishlistCount);
  }
}
