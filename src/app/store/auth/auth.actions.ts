import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Load Auths': emptyProps(),
    'Load Auths Success': props<{ data: unknown }>(),
    'Load Auths Failure': props<{ error: unknown }>(),
  }
});
