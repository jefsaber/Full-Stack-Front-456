import { createAction, props } from '@ngrx/store';

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  newsletter: boolean;
  defaultMinRating?: number;
}

export interface OrderSummary {
  id: string;
  date: string;
  total: number;
  status: 'en_cours' | 'expediee' | 'livree';
  itemCount: number;
}

export interface OrderDetail extends OrderSummary {
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  deliveryAddress: Address;
  deliveryOption: 'standard' | 'express';
  trackingUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  defaultAddress?: Address;
  preferences: UserPreferences;
  orders: OrderSummary[];
}

// User Profile Actions
export const loadUserProfile = createAction('[User] Load User Profile');

export const loadUserProfileSuccess = createAction(
  '[User] Load User Profile Success',
  props<{ user: User }>()
);

export const loadUserProfileFailure = createAction(
  '[User] Load User Profile Failure',
  props<{ error: string }>()
);

export const updateUserPreferences = createAction(
  '[User] Update User Preferences',
  props<{ preferences: Partial<UserPreferences> }>()
);

export const updateUserPreferencesSuccess = createAction(
  '[User] Update User Preferences Success',
  props<{ preferences: UserPreferences }>()
);

export const updateUserPreferencesFailure = createAction(
  '[User] Update User Preferences Failure',
  props<{ error: string }>()
);

// User Orders Actions
export const loadUserOrders = createAction('[User] Load User Orders');

export const loadUserOrdersSuccess = createAction(
  '[User] Load User Orders Success',
  props<{ orders: OrderSummary[] }>()
);

export const loadUserOrdersFailure = createAction(
  '[User] Load User Orders Failure',
  props<{ error: string }>()
);

export const loadOrderDetail = createAction(
  '[User] Load Order Detail',
  props<{ orderId: string }>()
);

export const loadOrderDetailSuccess = createAction(
  '[User] Load Order Detail Success',
  props<{ order: OrderDetail }>()
);

export const loadOrderDetailFailure = createAction(
  '[User] Load Order Detail Failure',
  props<{ error: string }>()
);

export const setUserDefaultAddress = createAction(
  '[User] Set Default Address',
  props<{ address: Address }>()
);

export const addUserOrder = createAction(
  '[User] Add Order',
  props<{ order: OrderDetail }>()
);
