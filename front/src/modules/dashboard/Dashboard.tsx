// src/modules/dashboard/Dashboard.tsx
import React from 'react';
import { Layout, Button } from 'antd';
import { Outlet } from 'react-router-dom'; // Importante: importar Outlet
import { useAuth } from '../auth/AuthContext';
import MenuDynamic from '../MenuDynamic';

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider width={250} style={{ background: '#001529' }}>
        <div style={{ 
          height: '64px', 
          background: 'rgba(255,255,255,0.1)', 
          margin: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Mi App
        </div>
        <MenuDynamic />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{ 
          background: '#fff', 
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <Button type="primary" danger onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Header>

        {/* Contenido principal - aquí se renderizan las rutas hijas */}
        <Content style={{ 
          margin: '16px',
          padding: '16px',
          background: '#fff',
          borderRadius: '6px'
        }}>
          <Outlet /> {/* Esto renderiza las rutas hijas */}
        </Content>
      </Layout>
    </Layout>
  );
}