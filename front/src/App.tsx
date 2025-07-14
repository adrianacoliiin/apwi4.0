  // src/App.tsx
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

  import { AuthProvider } from './modules/auth/AuthContext';
  import Login from './modules/auth/Login';
  import AuthRoutes from './modules/auth/AuthRoutes';
  import Dashboard from './modules/dashboard/Dashboard';
  import routes from './core/menuRoutes';

  export default function App() {
    return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Ruta pública de login */}
            <Route path="/login" element={<Login />} />

            {/* Todas las rutas protegidas van dentro del Dashboard como layout */}
            <Route
              path="/"
              element={
                <AuthRoutes>
                  <Dashboard />
                </AuthRoutes>
              }
            >
              {/* Rutas anidadas que se renderizarán dentro del Dashboard */}
              {routes
                .filter(route => !route.hidden)
                .map(route => {
                  // Si la ruta es "/" la hacemos index
                  if (route.path === '/') {
                    return <Route index key="index" element={route.element} />;
                  }
                  // Para las demás rutas, removemos el "/" inicial para rutas anidadas
                  const childPath = route.path.replace(/^\//, '');
                  return (
                    <Route
                      key={route.path}
                      path={childPath}
                      element={route.element}
                    />
                  );
                })}
              
              {/* Ruta específica para dashboard si no está en menuRoutes */}
              <Route path="dashboard" element={<div>Dashboard Home</div>} />
            </Route>

            {/* Cualquier otra URL va a la ruta raíz */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    );
  }