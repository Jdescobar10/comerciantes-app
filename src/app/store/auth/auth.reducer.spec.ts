
import { authReducer } from './auth.reducer';
import { initialAuthState } from './auth.state';
import { loadAuth, loadAuthSuccess, loadAuthFailure, logout } from './auth.actions';

xdescribe('AuthService', () => {

  it('debe retornar el estado inicial por defecto', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialAuthState);
  });

  it('debe activar loading al despachar loadAuth', () => {
    const action = loadAuth({ email: 'admin@agremiacion.com', password: 'Admin$2026!' });
    const state = authReducer(initialAuthState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('debe guardar usuario y token al hacer loadAuthSuccess', () => {
    const user = { nombre: 'Carlos Mendoza', correo: 'admin@agremiacion.com', rol: 'Administrador' };
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    const action = loadAuthSuccess({ user, token });
    const state = authReducer(initialAuthState, action);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.loading).toBe(false);
  });

  it('debe guardar el error al hacer loadAuthFailure', () => {
    const action = loadAuthFailure({ error: 'Credenciales incorrectas' });
    const state = authReducer(initialAuthState, action);
    expect(state.error).toBe('Credenciales incorrectas');
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
  });

  it('debe limpiar el estado al hacer logout', () => {
    const estadoAutenticado = {
      ...initialAuthState,
      isAuthenticated: true,
      user: { nombre: 'Carlos', correo: 'admin@agremiacion.com', rol: 'Administrador' },
      token: 'token123'
    };
    const state = authReducer(estadoAutenticado, logout());
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

});