import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import { loadAuth, loadAuthSuccess, loadAuthFailure, logout } from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  on(loadAuth, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(loadAuthSuccess, (state, { user, token }) => ({
    ...state,
    isAuthenticated: true,
    user,
    token,
    loading: false,
    error: null
  })),

  on(loadAuthFailure, (state, { error }) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error
  })),

  on(logout, (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    token: null,
    error: null,
    loading: false
  }))
);