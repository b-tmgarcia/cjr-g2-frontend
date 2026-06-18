import api from './api';

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', { 
      email: email.trim(), 
      password 
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: { message?: string } } };
      throw {
        response: {
          data: {
            message: axiosError.response.data.message || 'Erro ao fazer login'
          }
        }
      };
    } else if (error && typeof error === 'object' && 'request' in error) {
      throw new Error('Erro de conexão com o servidor');
    } else {
      throw new Error((error as Error).message || 'Erro desconhecido');
    }
  }
};

export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  try {
    const response = await api.post('/auth/forgot-password', { 
      email: email.trim() 
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: { message?: string } } };
      throw {
        message: axiosError.response.data.message || 'Erro ao enviar email de recuperação'
      };
    } else if (error && typeof error === 'object' && 'request' in error) {
      throw new Error('Erro de conexão com o servidor');
    } else {
      throw new Error((error as Error).message || 'Erro desconhecido');
    }
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  return !!token;
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};