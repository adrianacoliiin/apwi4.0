// src/core/menuRoutes.tsx
import React from 'react';
import Dashboard from "../modules/dashboard/Dashboard";
import UserForm from "../modules/user/UserForm";
import ProductList from "../modules/product/ProductList";
import OrderList   from "../modules/order/OrderList";
import Login from '../modules/auth/Login';


export interface AppRoute {
  path: string;
  element: JSX.Element;
  label?: string;
  icon?: string;
  /** Si quieres filtrar el menú por rol */
  roleIds?: string[];
  hidden?: boolean;
}

const routes: AppRoute[] = [
  {
    path: '/',
    element: <UserForm />,
    label: 'Inicio',
    icon: 'HomeOutlined',
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    label: 'Dashboard',
    icon: 'DashboardOutlined',
    roleIds: ['665a1f2b40fd3a12b3e77611'], // ejemplo de roles permitidos
  },
  {
    path: '/users',
    element: <UserForm />,
    label: 'Usuarios',
    icon: 'UserOutlined',
    roleIds: ['665a1f2b40fd3a12b3e77611'],
  },

  {
    path: '/products',
    element: <ProductList />,
    label: 'Productos',
    icon: 'UnorderedListOutlined',
    roleIds: ['ADMIN_ROLE', 'USER_ROLE'],
    },
  {
    path: '/orders',
    element: <OrderList />,
    label: 'Órdenes',
    icon: 'ShoppingCartOutlined',
    roleIds: ['ADMIN_ROLE', 'USER_ROLE'],
    },
  // Si necesitas rutas ocultas (por ejemplo configuración o detalles)
  {
    path: '/settings',
    element: <div>Settings</div>,
    label: 'Ajustes',
    icon: 'SettingOutlined',
    hidden: true,
  },
  {
    path: '/login',
    element: <Login />,
    label: 'Login'
    // hidden: true  // no aparece en el menú
  },
];

export default routes;
