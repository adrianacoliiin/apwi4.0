import { Form, Input, Modal, Select, Checkbox } from 'antd';
import { useEffect } from 'react';

const { Option } = Select;

interface Role {
  type: string;
  name: string;
}

interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: Role[];
  status?: boolean;
}

const roleOptions = [
  { type: 'admin', name: 'Administrador' },
  { type: 'user', name: 'Usuario' },
  { type: 'moderator', name: 'Moderador' }
];

export default function UserModalForm({
  visible,
  message,
  onClose,
  onSave,
  user,
}: {
  visible: boolean;
  message: string;
  onClose: () => void;
  onSave: (usuario: any) => void;
  user: User | null;
}) {
  const [form] = Form.useForm();
  const isEditing = !!user;

  useEffect(() => {
    if (visible) {
      if (user) {
        // Para edición, prellenar todos los campos
        form.setFieldsValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role.map(r => r.type), // Solo enviamos los tipos para el select
          status: user.status
        });
      } else {
        // Para nuevo usuario, limpiar formulario con valores por defecto
        form.resetFields();
        form.setFieldsValue({
          role: ['user'], // Rol por defecto
          status: true // Estado activo por defecto
        });
      }
    }
  }, [visible, user, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Transformar los roles seleccionados a la estructura esperada por la API
      const transformedRoles = values.role.map((roleType: string) => {
        const roleOption = roleOptions.find(r => r.type === roleType);
        return {
          type: roleType,
          name: roleOption?.name || roleType
        };
      });

      const userData = {
        username: values.username,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        role: transformedRoles,
        ...(values.password && { password: values.password }) // Solo incluir password si se proporciona
      };

      onSave(userData);
      form.resetFields();
    } catch (error) {
      console.error("Errores en el formulario: ", error);
    }
  };

  return (
    <Modal
      title={message}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Guardar"
      cancelText="Cancelar"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="username" 
          label="Nombre de usuario" 
          rules={[
            { required: true, message: 'El nombre de usuario es obligatorio' },
            { min: 3, message: 'El nombre de usuario debe tener al menos 3 caracteres' }
          ]}
        >
          <Input placeholder="Ingrese nombre de usuario" />
        </Form.Item>

        <Form.Item 
          name="email" 
          label="Email" 
          rules={[
            { required: true, message: 'El email es obligatorio' },
            { type: 'email', message: 'Ingrese un email válido' }
          ]}
        >
          <Input placeholder="Ingrese email" />
        </Form.Item>

        <Form.Item 
          name="password" 
          label="Contraseña" 
          rules={[
            { 
              required: !isEditing, 
              message: 'La contraseña es obligatoria' 
            },
            { 
              min: 6, 
              message: 'La contraseña debe tener al menos 6 caracteres' 
            }
          ]}
        >
          <Input.Password 
            placeholder={isEditing ? "Dejar vacío para mantener contraseña actual" : "Ingrese contraseña"} 
          />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item 
            name="firstName" 
            label="Nombre" 
            rules={[{ required: true, message: 'El nombre es obligatorio' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Ingrese nombre" />
          </Form.Item>

          <Form.Item 
            name="lastName" 
            label="Apellido" 
            rules={[{ required: true, message: 'El apellido es obligatorio' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Ingrese apellido" />
          </Form.Item>
        </div>

        <Form.Item 
          name="role" 
          label="Roles" 
          rules={[
            { required: true, message: 'Debe seleccionar al menos un rol' }
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Seleccione roles"
            style={{ width: '100%' }}
          >
            {roleOptions.map(role => (
              <Option key={role.type} value={role.type}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {isEditing && (
          <Form.Item 
            name="status" 
            valuePropName="checked"
            label="Estado"
          >
            <Checkbox>Usuario activo</Checkbox>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}