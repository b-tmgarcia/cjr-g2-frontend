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
  } catch (error: any) {
    if (error.response) {
      throw {
        response: {
          data: {
            message: error.response.data.message || 'Erro ao fazer login'
          }
        }
      };
    } else if (error.request) {
      throw new Error('Erro de conexão com o servidor');
    } else {
      throw new Error(error.message || 'Erro desconhecido');
    }
  }
};

export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  try {
    const response = await api.post('/auth/forgot-password', { 
      email: email.trim() 
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message: error.response.data.message || 'Erro ao enviar email de recuperação'
      };
    } else if (error.request) {
      throw new Error('Erro de conexão com o servidor');
    } else {
      throw new Error(error.message || 'Erro desconhecido');
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