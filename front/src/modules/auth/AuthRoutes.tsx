// src/context/AuthRoutes.tsx
import React from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

interface AuthRoutesProps {
  children: ReactNode;
}

export default function AuthRoutes({ children }: AuthRoutesProps) {
  const { token, isLoading } = useAuth();

  console.log('AuthRoutes - Token:', token);
  console.log('AuthRoutes - IsLoading:', isLoading);

  // Mostrar loading mientras se inicializa
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Cargando...
      </div>
    );
  }

  // Si hay token, renderizamos el contenido protegido
  if (token) {
    console.log('AuthRoutes - Renderizando contenido protegido');
    return <>{children}</>;
  }
  
  // Si no, redirigimos al login
  console.log('AuthRoutes - Redirigiendo a login');
  return <Navigate to="/login" replace />;
}