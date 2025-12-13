import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { DevOrdersComponent } from './dev/dev-orders.component';
import { DevCartComponent } from './dev/dev-cart.component';
import { DevAdminComponent } from './dev/dev-admin.component';
import { DevReviewsComponent } from './dev/dev-reviews.component';
import { DevProfileComponent } from './dev/dev-profile.component';
import { AppPlaceholderComponent } from './app-placeholder.component';
import { LoginPageComponent } from './pages/login-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'shop',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () => import('./modules/shop/shop.module').then((module) => module.ShopModule),
  },
  {
    path: 'account',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () => import('./modules/account/account.module').then((module) => module.AccountModule),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () => import('./modules/admin/admin.module').then((module) => module.AdminModule),
  },
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  { path: 'dev/orders', component: DevOrdersComponent },
  { path: 'dev/cart', component: DevCartComponent },
  { path: 'dev/admin', component: DevAdminComponent },
  { path: 'dev/reviews', component: DevReviewsComponent },
  { path: 'dev/profile', component: DevProfileComponent },
  { path: 'app', component: AppPlaceholderComponent },
  { path: '**', redirectTo: '' },
];
