import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  duration?: number;
  action?: string;
}

const DEFAULT_DURATION = 4000;

/**
 * Global notification service wrapping MatSnackBar
 * Provides typed methods for different notification types
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  /**
   * Show a success notification (green)
   */
  success(message: string, options?: NotificationOptions): void {
    this.show(message, 'success', options);
  }

  /**
   * Show an error notification (red)
   */
  error(message: string, options?: NotificationOptions): void {
    this.show(message, 'error', options);
  }

  /**
   * Show a warning notification (orange)
   */
  warning(message: string, options?: NotificationOptions): void {
    this.show(message, 'warning', options);
  }

  /**
   * Show an info notification (blue)
   */
  info(message: string, options?: NotificationOptions): void {
    this.show(message, 'info', options);
  }

  /**
   * Internal method to display the snackbar
   */
  private show(message: string, type: NotificationType, options?: NotificationOptions): void {
    const config: MatSnackBarConfig = {
      duration: options?.duration ?? DEFAULT_DURATION,
      panelClass: [`notification-${type}`],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    };

    this.snackBar.open(message, options?.action ?? 'Fermer', config);
  }
}
