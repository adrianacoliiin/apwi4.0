import { Button, Input, Table, Modal } from 'antd';
import { useState } from 'react';
import UserModalForm from './UserModalForm';

const rawData = [
    { id: 1, name: 'Juan', email: 'juan@example.com', age: 30 },
    { id: 2, name: 'Ana', email: 'ana@example.com', age: 25 },
    { id: 3, name: 'Luis', email: 'luis@example.com', age: 40 },
    { id: 4, name: 'Carmen', email: 'carmen@example.com', age: 35 },
];

export default function UserData() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState(rawData);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [editingUser, setEditingUser] = useState<any | null>(null);

    const filteredData = data.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    const openEditModal = (record: any) => {
        setEditingUser(record);
        setModalMessage('Editar usuario');
        setModalVisible(true);
    };

    const openAddModal = () => {
        setEditingUser(null);
        setModalMessage('Agregar usuario');
        setModalVisible(true);
    };

    const handleDelete = (record: any) => {
        Modal.confirm({
            title: '¿Estás seguro?',
            content: `¿Deseas eliminar al usuario ${record.name}?`,
            okText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            onOk: () => {
                setData(data.filter(user => user.id !== record.id));
            },
        });
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const handleModalSave = (usuario: any) => {
        if (editingUser) {
            setData(data.map(u => u.id === editingUser.id ? { ...u, ...usuario } : u));
        } else {
            const newId = data.length ? Math.max(...data.map(u => u.id)) + 1 : 1;
            setData([...data, { id: newId, ...usuario }]);
        }
        setModalVisible(false);
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a: any, b: any) => a.email.localeCompare(b.email)
        },
        {
            title: 'Edad',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_: any, record: any) => (
                <>
                    <Button
                        type="primary"
                        size='small'
                        onClick={() => openEditModal(record)}
                        style={{ marginRight: 8 }}
                    >
                        Editar
                    </Button>
                    <Button
                        danger
                        size='small'
                        onClick={() => handleDelete(record)}
                    >
                        Borrar
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className='p-4'>
            <div style={{ marginBottom: 16 }}>
                <Input.Search
                    className='mr-2 w-60'
                    placeholder='Buscar'
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button type="primary" onClick={openAddModal}>
                    Nuevo usuario
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 2 }}
                rowKey="id"
            />
            <UserModalForm
                visible={modalVisible}
                message={modalMessage}
                onClose={handleModalClose}
                onSave={handleModalSave}
                user={editingUser}
            />
        </div>
    );
}
