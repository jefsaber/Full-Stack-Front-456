import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as CartActions from '../state/cart/cart.actions';
import { CartItem } from '../state/cart/cart.actions';
import * as WishlistActions from '../state/wishlist/wishlist.actions';

const CART_STORAGE_KEY = 'shop_cart_state';
const WISHLIST_STORAGE_KEY = 'shop_wishlist_state';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private store: Store) {
    this.initializeCartFromStorage();
    this.initializeWishlistFromStorage();
  }

  private initializeCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const items: CartItem[] = JSON.parse(savedCart);
        this.store.dispatch(CartActions.loadCartFromStorage({ items }));
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  }

  private initializeWishlistFromStorage(): void {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        const ids: number[] = JSON.parse(savedWishlist);
        this.store.dispatch(WishlistActions.setWishlist({ ids }));
      }
    } catch (error) {
      console.error('Failed to load wishlist from storage:', error);
    }
  }
}
