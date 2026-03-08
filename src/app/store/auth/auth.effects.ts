import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { loadAuth, loadAuthSuccess, loadAuthFailure, logout } from './auth.actions';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class AuthEffects {

  login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadAuth),
    switchMap(({ email, password }) =>
      this.authService.login(email, password).pipe(
        map((response) => loadAuthSuccess({
          user: {
            nombre: response.nombre,
            correo: response.correo,
            rol: response.rol
          },
          token: response.token
        })),
        catchError((error) => of(loadAuthFailure({
          error: error.error?.message || 'Credenciales incorrectas'
        })))
      )
    )
  )
);

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAuthSuccess),
      tap(() => this.router.navigate(['/merchants']))
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => this.router.navigate(['/login']))
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}