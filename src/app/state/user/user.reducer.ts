import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import {
  User,
  OrderSummary,
  OrderDetail,
} from './user.actions';

export interface UserState {
  currentUser: User | null;
  orders: OrderSummary[];
  selectedOrder: OrderDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  // Load profile
  on(UserActions.loadUserProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadUserProfileSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    orders: user.orders,
    loading: false,
  })),
  on(UserActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update preferences
  on(UserActions.updateUserPreferences, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.updateUserPreferencesSuccess, (state, { preferences }) => ({
    ...state,
    currentUser: state.currentUser
      ? { ...state.currentUser, preferences }
      : null,
    loading: false,
  })),
  on(UserActions.updateUserPreferencesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load orders
  on(UserActions.loadUserOrders, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadUserOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false,
  })),
  on(UserActions.loadUserOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load order detail
  on(UserActions.loadOrderDetail, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadOrderDetailSuccess, (state, { order }) => ({
    ...state,
    selectedOrder: order,
    loading: false,
  })),
  on(UserActions.loadOrderDetailFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add order after checkout
  on(UserActions.addUserOrder, (state, { order }) => {
    const orderSummary: OrderSummary = {
      id: order.id,
      date: order.date,
      total: order.total,
      status: order.status,
      itemCount: order.itemCount,
    };

    return {
      ...state,
      orders: [...state.orders, orderSummary],
      currentUser: state.currentUser
        ? {
            ...state.currentUser,
            orders: [...state.currentUser.orders, orderSummary],
          }
        : null,
    };
  }),

  // Update default address when the user places a new order
  on(UserActions.setUserDefaultAddress, (state, { address }) => ({
    ...state,
    currentUser: state.currentUser
      ? { ...state.currentUser, defaultAddress: address }
      : null,
  }))
);
