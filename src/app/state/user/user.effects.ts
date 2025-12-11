import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UserActions from './user.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private shopApiService = inject(ShopApiService);
  private snackBar = inject(MatSnackBar);

  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserProfile),
      switchMap(() =>
        this.shopApiService.getUserProfile().pipe(
          map((user) => UserActions.loadUserProfileSuccess({ user })),
          catchError((error) =>
            of(
              UserActions.loadUserProfileFailure({
                error: 'Erreur lors du chargement du profil',
              })
            )
          )
        )
      )
    )
  );

  updateUserPreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserPreferences),
      switchMap(({ preferences }) =>
        this.shopApiService.updateUserPreferences(preferences).pipe(
          map((updatedPreferences) => {
            this.snackBar.open(
              'Préférences mises à jour avec succès',
              'Fermer',
              { duration: 3000 }
            );
            return UserActions.updateUserPreferencesSuccess({
              preferences: updatedPreferences,
            });
          }),
          catchError((error) =>
            of(
              UserActions.updateUserPreferencesFailure({
                error: 'Erreur lors de la mise à jour des préférences',
              })
            )
          )
        )
      )
    )
  );

  loadUserOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserOrders),
      switchMap(() =>
        this.shopApiService.getUserOrders().pipe(
          map((orders) => UserActions.loadUserOrdersSuccess({ orders })),
          catchError((error) =>
            of(
              UserActions.loadUserOrdersFailure({
                error: 'Erreur lors du chargement des commandes',
              })
            )
          )
        )
      )
    )
  );

  loadOrderDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadOrderDetail),
      switchMap(({ orderId }) =>
        this.shopApiService.getOrderDetail(orderId).pipe(
          map((order) => UserActions.loadOrderDetailSuccess({ order })),
          catchError((error) =>
            of(
              UserActions.loadOrderDetailFailure({
                error: 'Erreur lors du chargement de la commande',
              })
            )
          )
        )
      )
    )
  );
}
