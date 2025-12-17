import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsPageComponent } from '../../pages/products-page.component';
import { ProductDetailsPageComponent } from '../../pages/product-details-page.component';
import { ProductRatingPageComponent } from '../../pages/product-rating-page.component';
import { CartPageComponent } from '../../pages/cart-page.component';
import { CheckoutPageComponent } from '../../pages/checkout-page.component';
import { checkoutGuard } from '../../guards/checkout.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'products', component: ProductsPageComponent },
  { path: 'products/:id', component: ProductDetailsPageComponent },
  { path: 'rating', component: ProductRatingPageComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: CheckoutPageComponent, canActivate: [checkoutGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopModule {}
