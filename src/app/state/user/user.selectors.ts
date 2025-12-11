import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

const userFeatureKey = 'user';

export const selectUserState = createFeatureSelector<UserState>(userFeatureKey);

// User profile selectors
export const selectCurrentUser = createSelector(
  selectUserState,
  (state) => state.currentUser
);

export const selectUserEmail = createSelector(
  selectCurrentUser,
  (user) => user?.email || ''
);

export const selectUserFullName = createSelector(
  selectCurrentUser,
  (user) => user?.fullName || user?.username || ''
);

export const selectUserPreferences = createSelector(
  selectCurrentUser,
  (user) => user?.preferences || { newsletter: false }
);

export const selectUserNewsletterStatus = createSelector(
  selectUserPreferences,
  (preferences) => preferences.newsletter
);

export const selectUserDefaultMinRating = createSelector(
  selectUserPreferences,
  (preferences) => preferences.defaultMinRating || 0
);

// Orders selectors
export const selectUserOrders = createSelector(
  selectUserState,
  (state) => state.orders
);

export const selectOrderCount = createSelector(
  selectUserOrders,
  (orders) => orders.length
);

export const selectOrdersGroupedByStatus = createSelector(
  selectUserOrders,
  (orders) => ({
    pending: orders.filter((o) => o.status === 'en_cours'),
    shipped: orders.filter((o) => o.status === 'expediee'),
    delivered: orders.filter((o) => o.status === 'livree'),
  })
);

// Order detail selectors
export const selectSelectedOrder = createSelector(
  selectUserState,
  (state) => state.selectedOrder
);

export const selectSelectedOrderItems = createSelector(
  selectSelectedOrder,
  (order) => order?.items || []
);

export const selectSelectedOrderCosts = createSelector(
  selectSelectedOrder,
  (order) =>
    order ? {
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
    } : null
);

// Loading and error selectors
export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state) => state.error
);
