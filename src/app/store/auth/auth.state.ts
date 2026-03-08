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
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
  loading: false
};