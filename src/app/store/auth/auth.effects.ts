import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { loadAuth, loadAuthSuccess, loadAuthFailure, logout } from './auth.actions';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAuth),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
      
  map((response) => {
    const token = response.data.token;
    const user = {
      nombre: response.data.nombreUsuario,
      correo: email,
      rol: response.data.rol
    };
    sessionStorage.setItem('token', token);
    return loadAuthSuccess({ user, token });
  }),

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
      tap(() => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  );
}