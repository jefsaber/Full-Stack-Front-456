import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartItems } from '../state/cart/cart.selectors';
import { take, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Guard that prevents access to checkout if cart is empty
 */
export const checkoutGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return store.select(selectCartItems).pipe(
    take(1),
    map((items) => {
      if (items && items.length > 0) {
        return true;
      }

      snackBar.open('Votre panier est vide. Ajoutez des produits avant de passer commande.', 'Fermer', {
        duration: 4000,
        panelClass: ['error-snackbar'],
      });

      router.navigate(['/shop/products']);
      return false;
    })
  );
};
