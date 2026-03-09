export interface User {
  nombre: string;
  correo: string;
  rol: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
  loading: boolean;
}

export const initialAuthState: AuthState = {
  isAuthenticated: !!sessionStorage.getItem('token'),
  user: null,
  token: sessionStorage.getItem('token'),
  error: null,
  loading: false
};