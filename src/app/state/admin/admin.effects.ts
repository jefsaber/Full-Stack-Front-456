import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as AdminActions from './admin.actions';
import { AdminDashboardService } from '../../services/admin-dashboard.service';

@Injectable()
export class AdminEffects {
  private readonly actions$ = inject(Actions);
  private readonly adminDashboardService = inject(AdminDashboardService);

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminDashboard),
      switchMap(() =>
        this.adminDashboardService.fetchDashboard().pipe(
          map((stats) => AdminActions.loadAdminDashboardSuccess({ stats })),
          catchError((error) =>
            of(
              AdminActions.loadAdminDashboardFailure({
                error: error?.message ?? 'Impossible de charger les statistiques',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
