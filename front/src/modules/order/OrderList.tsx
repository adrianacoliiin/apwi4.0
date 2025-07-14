import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tag, Modal, Form, InputNumber, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Search } = Input;

interface ProductInOrder {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  idUser: string;
  status: string;
  products: ProductInOrder[];
  subtotal: number;
  total: number;
  Date: string;
}

interface EditOrderForm {
  idUser: string;
  products: ProductInOrder[];
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3002/api/auth/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      message.error('Error al cargar las órdenes');
    }
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    form.setFieldsValue({
      idUser: order.idUser,
      products: order.products
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (values: EditOrderForm) => {
    if (!selectedOrder) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3002/api/auth/orders/${selectedOrder._id}`,
        values
      );
      
      // Actualizar la orden en el estado local
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === selectedOrder._id ? response.data.orderPaid : order
        )
      );
      
      message.success('Orden actualizada exitosamente');
      setIsEditModalOpen(false);
      form.resetFields();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      message.error('Error al actualizar la orden');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;

    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:3002/api/auth/orders/${selectedOrder._id}`);
      
      // Actualizar la orden en el estado local con el estado "Cancelado"
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === selectedOrder._id ? response.data.orderPaid : order
        )
      );
      
      message.success('Orden cancelada exitosamente');
      setIsDeleteModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      message.error('Error al cancelar la orden');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
    setSelectedOrder(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((order) =>
    order.idUser.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Usuario',
      dataIndex: 'idUser',
      key: 'idUser',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        switch (status) {
          case 'Pendiente':
            color = 'orange';
            break;
          case 'Pagado':
            color = 'green';
            break;
          case 'Cancelado':
            color = 'red';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Productos',
      dataIndex: 'products',
      key: 'products',
      render: (products: ProductInOrder[]) => (
        <span>{products.length} producto(s)</span>
      ),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Fecha',
      dataIndex: 'Date',
      key: 'Date',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Button 
            danger 
            size="small"
            onClick={() => handleDelete(record)}
          >
            Cancelar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Search
        className="mb-4 w-60"
        placeholder="Buscar por ID de usuario..."
        onChange={(e) => setSearch(e.target.value)}
        allowClear
      />
      
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal de Edición */}
      <Modal
        title="Editar Orden"
        open={isEditModalOpen}
        onOk={form.submit}
        onCancel={handleEditCancel}
        confirmLoading={loading}
        okText="Guardar"
        cancelText="Cancelar"
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            label="ID Usuario"
            name="idUser"
            rules={[{ required: true, message: 'Por favor ingresa el ID del usuario' }]}
          >
            <Input placeholder="ID del usuario" />
          </Form.Item>

          <Form.Item label="Productos">
            <Form.List name="products">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'productId']}
                        rules={[{ required: true, message: 'ID del producto requerido' }]}
                      >
                        <Input placeholder="ID del producto" style={{ width: 200 }} />
                      </Form.Item>
                      
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: 'Cantidad requerida' }]}
                      >
                        <InputNumber<number>
                          placeholder="Cantidad" 
                          min={1} 
                          style={{ width: 100 }}
                        />
                      </Form.Item>
                      
                      <Form.Item
                        {...restField}
                        name={[name, 'price']}
                        rules={[{ required: true, message: 'Precio requerido' }]}
                      >
                        <InputNumber<number> 
                          placeholder="Precio" 
                          min={0} 
                          step={0.01}
                          style={{ width: 100 }}
                          formatter={(value) => value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                          parser={(value) => parseFloat(value?.replace(/\$\s?|(,*)/g, '') || '0') || 0}
                        />
                      </Form.Item>
                      
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Agregar Producto
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

        </Form>
      </Modal>

      {/* Modal de Confirmación de Cancelación */}
      <Modal
        title="Confirmar Cancelación"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmLoading={loading}
        okText="Sí, cancelar"
        cancelText="No cancelar"
        okButtonProps={{ danger: true }}
      >
        <p>
          ¿Estás seguro que deseas cancelar la orden del usuario <strong>{selectedOrder?.idUser}</strong>?
        </p>
        <p>Esta acción cambiará el estado de la orden a "Cancelado".</p>
      </Modal>
    </div>
  );
}