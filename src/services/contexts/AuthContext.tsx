'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginService, logout as logoutService, isAuthenticated } from '@/services/auth';
import { User, AuthContextType, RegisterCredentials } from '@/types/auth';
import { toast } from 'react-toastify';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          // Aqui você pode buscar os dados do usuário da API
          // const userData = await getUserProfile();
          // setUser(userData);
          
          // Por enquanto, vamos apenas simular um usuário
          setUser({
            id: '1',
            email: 'usuario@exemplo.com',
            name: 'Usuário Exemplo'
          });
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
          logoutService();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginService(email, password);
      if (data.user) {
        setUser(data.user);
      } else {
        // Se a API não retornar o usuário, você pode buscá-lo depois
        setUser({
          id: 'temp-id',
          email: email,
        });
      }
      toast.success('Login realizado com sucesso!');
      router.push('/');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string | string[] } } };
      const message = axiosError.response?.data?.message || (error as Error)?.message || 'Erro ao fazer login';
      toast.error(Array.isArray(message) ? message.join(", ") : message);
      throw error;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    router.push('/login');
    toast.success('Logout realizado com sucesso!');
  };

  const register = async (data: RegisterCredentials) => {
    try {
      // Implementar chamada de registro aqui
      // const response = await registerService(data);
      toast.success('Cadastro realizado com sucesso! Faça login.');
      router.push('/login');
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Erro ao realizar cadastro');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
