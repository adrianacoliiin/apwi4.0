// src/context/AuthContext.tsx
import { createContext, useEffect, useState, useContext } from 'react';

export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const defaultAuth: AuthContextType = {
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType>(defaultAuth);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Inicializando...');
    
    try {
      const localToken = localStorage.getItem('token');
      console.log('Token desde localStorage:', localToken);
      
      if (localToken) {
        setToken(localToken);
        console.log('Token establecido desde localStorage');
      }
    } catch (error) {
      console.error('Error al leer localStorage:', error);
    } finally {
      setIsLoading(false);
      console.log('AuthProvider: Inicialización completada');
    }
  }, []);

  const login = (loginToken: string) => {
    console.log('Login ejecutado con token:', loginToken);
    
    try {
      localStorage.setItem('token', loginToken);
      setToken(loginToken);
      console.log('Token guardado exitosamente en localStorage y estado');
    } catch (error) {
      console.error('Error al guardar token:', error);
    }
  };

  const logout = () => {
    console.log('Logout ejecutado');
    
    try {
      localStorage.removeItem('token');
      setToken(null);
      console.log('Token removido exitosamente');
    } catch (error) {
      console.error('Error al remover token:', error);
    }
  };

  // Debug: mostrar cambios en el token
  useEffect(() => {
    console.log('Estado del token cambió:', token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook de conveniencia para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}