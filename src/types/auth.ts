export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  email: string;
  token: string;
  newPassword: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register?: (data: RegisterCredentials) => Promise<void>;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface ErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}