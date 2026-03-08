import { createAction, props } from '@ngrx/store';
import { User } from './auth.state';

export const loadAuth = createAction('[Auth] Load Auth');

export const loadAuthSuccess = createAction(
  '[Auth] Load Auth Success',
  props<{ user: User; token: string }>()
);

export const loadAuthFailure = createAction(
  '[Auth] Load Auth Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');