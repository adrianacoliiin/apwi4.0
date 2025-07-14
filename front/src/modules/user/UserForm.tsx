import { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Modal, message } from 'antd';
import axios from 'axios';
import UserModalForm from './UserModalForm';

const { Search } = Input;

interface Role {
  type: string;
  name: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  status: boolean;
  role: Role[];
  firstName: string;
  lastName: string;
}

export default function UserData() {
  const [rawData, setRawData] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  console.log('UserData component renderizado');
  console.log('rawData actual:', rawData);

  const fetchUsers = async () => {
    console.log('Iniciando fetchUsers...');
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/auth/users');
      console.log('Respuesta completa de fetchUsers:', res);
      console.log('Datos recibidos:', res.data);
      console.log('Lista de usuarios:', res.data.userList);
      
      setRawData(res.data.userList || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error response:', error.response);
      message.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredData = rawData.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const openEditModal = (record: User) => {
    setEditingUser(record);
    setModalMessage('Editar usuario');
    setModalVisible(true);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setModalMessage('Agregar usuario');
    setModalVisible(true);
  };

  const handleDelete = (record: User) => {
    console.log('Intentando eliminar usuario:', record);
    console.log('ID del usuario:', record._id);
    setUserToDelete(record);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    console.log('Ejecutando eliminación...');
    try {
      const url = `http://localhost:3000/api/auth/users/delete/${userToDelete._id}`;
      console.log('URL de eliminación:', url);
      
      const response = await axios.delete(url);
      console.log('Respuesta del servidor:', response);
      console.log('Datos de respuesta:', response.data);
      
      message.success('Usuario eliminado exitosamente');
      setDeleteModalVisible(false);
      setUserToDelete(null);
      fetchUsers(); // Recargar la lista
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      
      message.error('Error al eliminar usuario');
    }
  };

  const cancelDelete = () => {
    console.log('Eliminación cancelada');
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingUser(null);
  };

  const handleModalSave = async (userData: any) => {
    try {
      if (editingUser) {
        // Actualizar usuario existente
        await axios.put(`http://localhost:3000/api/auth/users/update/${editingUser._id}`, userData);
        message.success('Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        await axios.post('http://localhost:3000/api/auth/users', userData);
        message.success('Usuario creado exitosamente');
      }
      
      setModalVisible(false);
      setEditingUser(null);
      fetchUsers(); // Recargar la lista
    } catch (error) {
      console.error('Error saving user:', error);
      message.error('Error al guardar usuario');
    }
  };

  const columns = [
    {
      title: 'Nombre de Usuario',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Nombre',
      key: 'fullName',
      render: (record: User) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (roles: Role[]) => roles.map((r) => r.name).join(', '),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <span style={{ color: status ? 'green' : 'red' }}>
          {status ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            onClick={() => openEditModal(record)}
          >
            Editar
          </Button>
          <Button 
            danger 
            size="small"
            onClick={() => handleDelete(record)}
          >
            Borrar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div style={{ marginBottom: 16 }}>
        <Search
          className="mr-2 w-60"
          placeholder="Buscar usuario..."
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Button type="primary" onClick={openAddModal}>
          Nuevo usuario
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        loading={loading}
      />

      <UserModalForm
        visible={modalVisible}
        message={modalMessage}
        onClose={handleModalClose}
        onSave={handleModalSave}
        user={editingUser}
      />

      <Modal
        title="Confirmar eliminación"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Sí, eliminar"
        cancelText="Cancelar"
        okButtonProps={{ danger: true }}
      >
        <p>¿Estás seguro que deseas eliminar al usuario <strong>{userToDelete?.username}</strong>?</p>
        <p>Esta acción no se puede deshacer.</p>
      </Modal>
    </div>
  );
}