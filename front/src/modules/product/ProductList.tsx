import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tag, Modal, Form, InputNumber, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Search } = Input;

interface Product {
  _id: string;
  name: string;
  price: number;
  Qty: number;
  status: boolean;
  desc: string;
  deleteDate: string | null;
  createDate: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3003/api/auth/product');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      message.error('Error al cargar los productos');
    }
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3003/api/auth/product',
        {
          name: values.name,
          price: values.price.toString(),
          Qty: values.Qty.toString(),
          desc: values.desc,
        }
      );

      if (response.data.message === 'Product created successfully') {
        message.success('Producto creado exitosamente');
        setIsCreateModalOpen(false);
        createForm.resetFields();
        fetchProducts(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error creating product:', error);
      message.error('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      Qty: product.Qty,
      desc: product.desc,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (values: any) => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3003/api/auth/product/${selectedProduct._id}`,
        {
          name: values.name,
          price: values.price.toString(),
          Qty: values.Qty.toString(),
          desc: values.desc,
        }
      );

      if (response.data.message === 'Product updated successfully') {
        message.success('Producto actualizado exitosamente');
        setIsEditModalOpen(false);
        form.resetFields();
        fetchProducts(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:3003/api/auth/product/${selectedProduct._id}`
      );

      if (response.data.message === 'Product deleted successfully') {
        message.success('Producto eliminado exitosamente');
        setIsDeleteModalOpen(false);
        fetchProducts(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
    setSelectedProduct(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Cantidad',
      dataIndex: 'Qty',
      key: 'Qty',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) =>
        status ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>,
    },
    {
      title: 'Descripción',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Product) => (
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
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <Search
          className="w-60"
          placeholder="Buscar producto..."
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Button
          type="primary"
          onClick={handleCreate}
          className="ml-4"
        >
          Crear Producto
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal de Edición */}
      <Modal
        title="Editar Producto"
        open={isEditModalOpen}
        onOk={form.submit}
        onCancel={handleEditCancel}
        confirmLoading={loading}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingresa el nombre del producto' }]}
          >
            <Input placeholder="Nombre del producto" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Precio"
            rules={[{ required: true, message: 'Por favor ingresa el precio' }]}
          >
            <InputNumber<number>
              style={{ width: '100%' }}
              placeholder="Precio"
              min={0}
              step={0.01}
              formatter={(value) => value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
              parser={(value) => parseFloat(value?.replace(/\$\s?|(,*)/g, '') || '0') || 0}
            />
          </Form.Item>

          <Form.Item
            name="Qty"
            label="Cantidad"
            rules={[{ required: true, message: 'Por favor ingresa la cantidad' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Cantidad"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="desc"
            label="Descripción"
            rules={[{ required: true, message: 'Por favor ingresa la descripción' }]}
          >
            <Input placeholder="Descripción" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Creación */}
      <Modal
        title="Crear Nuevo Producto"
        open={isCreateModalOpen}
        onOk={createForm.submit}
        onCancel={handleCreateCancel}
        confirmLoading={loading}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateSubmit}
        >
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingresa el nombre del producto' }]}
          >
            <Input placeholder="Nombre del producto" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Precio"
            rules={[{ required: true, message: 'Por favor ingresa el precio' }]}
          >
            <InputNumber<number>
              style={{ width: '100%' }}
              placeholder="Precio"
              min={0}
              step={0.01}
              formatter={(value) => value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
              parser={(value) => parseFloat(value?.replace(/\$\s?|(,*)/g, '') || '0') || 0}
            />
          </Form.Item>

          <Form.Item
            name="Qty"
            label="Cantidad"
            rules={[{ required: true, message: 'Por favor ingresa la cantidad' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Cantidad"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="desc"
            label="Descripción"
            rules={[{ required: true, message: 'Por favor ingresa la descripción' }]}
          >
            <Input placeholder="Descripción" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        title="Confirmar Eliminación"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmLoading={loading}
        okText="Sí, eliminar"
        cancelText="Cancelar"
        okButtonProps={{ danger: true }}
      >
        <p>
          ¿Estás seguro que deseas eliminar el producto <strong>{selectedProduct?.name}</strong>?
        </p>
        <p>Esta acción no se puede deshacer.</p>
      </Modal>
    </div>
  );
}