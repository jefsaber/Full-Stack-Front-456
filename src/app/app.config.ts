import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection, isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './state/auth/auth.reducer';
import { productsReducer } from './state/products/products.reducer';
import { cartReducer } from './state/cart/cart.reducer';
import { userReducer } from './state/user/user.reducer';
import { wishlistReducer } from './state/wishlist/wishlist.reducer';
import { reviewsReducer } from './state/reviews/reviews.reducer';
import { adminReducer } from './state/admin/admin.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { ProductsEffects } from './state/products/products.effects';
import { CartEffects } from './state/cart/cart.effects';
import { UserEffects } from './state/user/user.effects';
import { WishlistEffects } from './state/wishlist/wishlist.effects';
import { ReviewsEffects } from './state/reviews/reviews.effects';
import { AdminEffects } from './state/admin/admin.effects';
import { authInterceptor } from './services/auth.interceptor';
import { StorageService } from './services/storage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
      user: userReducer,
      wishlist: wishlistReducer,
      reviews: reviewsReducer,
      admin: adminReducer,
    }),
    provideEffects([
      AuthEffects,
      ProductsEffects,
      CartEffects,
      UserEffects,
      WishlistEffects,
      ReviewsEffects,
      AdminEffects,
    ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    StorageService, // Initialize on app startup
  ],
};
