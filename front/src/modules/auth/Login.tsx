// src/modules/auth/Login.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useAuth } from './AuthContext'; // Path corregido

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

export default function Login() {
  const [formData] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlerSubmit = async (values: LoginFormValues) => {
    try {
      console.log('Enviando datos:', values);
      
      const response = await fetch('http://localhost:3000/api/auth/login-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error al autenticar usuario');
      }

      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.accessToken) {
        login(data.accessToken); // Guarda el token en el contexto
        console.log('Token guardado exitosamente');
        
        message.success('Login exitoso');
        
        // Esperar un poco antes de navegar para asegurar que el contexto se actualice
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
        
        formData.resetFields();
      } else {
        throw new Error('No se recibió el token de acceso');
      }
    } catch (error) {
      console.error('Error en login:', error);
      message.error('Credenciales incorrectas o error de red');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 360 }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Iniciar sesión
        </Title>
        <Form
          form={formData}
          name="login"
          layout="vertical"
          initialValues={{ username: '', password: '' }}
          onFinish={handlerSubmit}
        >
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa tu usuario' }]}
          >
            <Input placeholder="Usuario" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}