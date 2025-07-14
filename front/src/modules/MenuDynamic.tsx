// src/modules/MenuDynamic.tsx
import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Importa aquí todos los íconos que uses en la API
import {
  HomeOutlined,
  DashboardOutlined,
  UserOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  SettingOutlined
} from '@ant-design/icons';

// Mapa de nombre de ícono → componente
const IconsMap = {
  HomeOutlined,
  DashboardOutlined,
  UserOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  SettingOutlined
};

interface MenuItem {
  _id: string;
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

const MenuDynamic: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get('http://localhost:3009/api/auth/menu');
        console.log(res)
        setMenus(res.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        color: 'white', 
        padding: '1rem', 
        textAlign: 'center' 
      }}>
        Cargando menú...
      </div>
    );
  }

  // Genera los items del menú a partir de la API
  const items = menus.map(menu => {
    const IconComp = IconsMap[menu.icon as keyof typeof IconsMap];
    return {
      key: menu.path,
      icon: IconComp ? <IconComp /> : null,
      label: menu.label
    };
  });

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[pathname]}
      onClick={({ key }) => navigate(key)}
      items={items}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
};

export default MenuDynamic;