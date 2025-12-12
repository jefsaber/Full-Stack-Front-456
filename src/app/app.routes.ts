import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { AppPlaceholderComponent } from './app-placeholder.component';
import { LoginPageComponent } from './pages/login-page.component';
import { ProductsPageComponent } from './pages/products-page.component';
import { ProductRatingPageComponent } from './pages/product-rating-page.component';
import { ProductDetailsPageComponent } from './pages/product-details-page.component';
import { CartPageComponent } from './pages/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page.component';
import { WishlistPageComponent } from './pages/wishlist-page.component';
import { AccountProfileComponent } from './pages/account/account-profile.component';
import { AccountOrdersComponent } from './pages/account/account-orders.component';
import { AccountOrderDetailsComponent } from './pages/account/account-order-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'shop',
    canActivate: [authGuard],
    children: [
      { path: 'products', component: ProductsPageComponent },
      { path: 'products/:id', component: ProductDetailsPageComponent },
      { path: 'rating', component: ProductRatingPageComponent },
      { path: 'cart', component: CartPageComponent },
      { path: 'wishlist', component: WishlistPageComponent },
      { path: 'checkout', component: CheckoutPageComponent },
    ],
  },
  {
    path: 'account',
    canActivate: [authGuard],
    children: [
      { path: 'profile', component: AccountProfileComponent },
      { path: 'orders', component: AccountOrdersComponent },
      { path: 'orders/:id', component: AccountOrderDetailsComponent },
    ],
  },
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  { path: 'app', component: AppPlaceholderComponent },
  { path: '**', redirectTo: '' },
];
