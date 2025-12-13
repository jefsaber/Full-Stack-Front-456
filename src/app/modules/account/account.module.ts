import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountProfileComponent } from '../../pages/account/account-profile.component';
import { AccountOrdersComponent } from '../../pages/account/account-orders.component';
import { AccountOrderDetailsComponent } from '../../pages/account/account-order-details.component';
import { WishlistPageComponent } from '../../pages/wishlist-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'profile' },
  { path: 'profile', component: AccountProfileComponent },
  { path: 'orders', component: AccountOrdersComponent },
  { path: 'orders/:id', component: AccountOrderDetailsComponent },
  { path: 'wishlist', component: WishlistPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountModule {}
