import { useState, useEffect, useContext } from 'react';
import { Typography, Tabs, Spin, Table, Tag, Button, Modal, Form, Input, InputNumber, message, Upload, Select, Popconfirm } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload as UploadIcon, Trash2 } from 'lucide-react';
import api, { API_BASE_URL } from '../api/axios';

const { Title } = Typography;
const { TabPane } = Tabs;

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');
  const [data, setData] = useState({
    products: [],
    orders: []
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      message.error('Not authorized as admin');
      navigate('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      setLoading(true);
      try {
        if (activeTab === '1') {
            const productsRes = await api.get('/shop/products');
            setData(prev => ({ ...prev, products: productsRes.data }));
        } else if (activeTab === '2') {
            const ordersRes = await api.get('/shop/orders/all');
            setData(prev => ({ ...prev, orders: ordersRes.data }));
        }
      } catch (error) {
        console.error('Failed to load admin data');
        message.error('Failed to load data');
      }
      setLoading(false);
    };

    if (user && user.role === 'admin') {
         fetchAdminData();
    }
  }, [user, navigate, activeTab]);

  const handleCreateProduct = async (values: any) => {
    try {
      let imageUrl = 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80';
      if (values.image && Array.isArray(values.image) && values.image.length > 0) {
          const file = values.image[0].originFileObj;
          if (file) {
              const formData = new FormData();
              formData.append('image', file);
              const { data } = await api.post('/upload', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              });
              imageUrl = data.image.startsWith('http') ? data.image : `${API_BASE_URL}${data.image}`;
          }
      }

      const requestData = {
          ...values,
          image: imageUrl
      };

      await api.post('/shop/products', requestData);
      message.success('Product created successfully');
      setIsProductModalOpen(false);
      form.resetFields();
      
      // Refresh products
      const productsRes = await api.get('/shop/products');
      setData(prev => ({ ...prev, products: productsRes.data }));
    } catch (error) {
      console.error(error);
      message.error('Failed to create product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.delete(`/shop/products/${productId}`);
      message.success('Product deleted successfully');
      setData(prev => ({ 
         ...prev, 
         products: prev.products.filter((p: any) => p._id !== productId) 
      }));
    } catch (error) {
      console.error(error);
      message.error('Failed to delete product');
    }
  };

  const handleUpdateShippingStatus = async (orderId: string, status: string) => {
      try {
          await api.put(`/shop/orders/${orderId}/status`, { shippingStatus: status });
          message.success('Shipping status updated');
          
          // Refresh orders
          const ordersRes = await api.get('/shop/orders/all');
          setData(prev => ({ ...prev, orders: ordersRes.data }));
      } catch (error) {
          message.error('Failed to update shipping status');
      }
  };

  if (loading && (!data.products.length && !data.orders.length)) {
      return <div style={{ textAlign: 'center', marginTop: '100px' }}><Spin size="large" /></div>;
  }

  return (
    <div className="page-container" style={{ padding: '40px 24px' }}>
      <Title level={2} style={{ marginBottom: '32px' }}>Admin Dashboard</Title>
      
      <Tabs defaultActiveKey="1" size="large" onChange={setActiveTab}>
         <TabPane tab="Manage Products" key="1">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Button type="primary" icon={<Plus size={16} />} onClick={() => setIsProductModalOpen(true)}>Add Product</Button>
            </div>
            
            <Table 
               dataSource={data.products} 
               rowKey="_id"
               loading={loading}
               columns={[
                  { 
                     title: 'Product', 
                     key: 'product', 
                     render: (_, record: any) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <img src={record.image} alt={record.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} />
                           <span style={{ fontWeight: 500 }}>{record.name}</span>
                        </div>
                     )
                  },
                  { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text.toFixed(2)}` },
                  { title: 'Stock', dataIndex: 'countInStock', key: 'countInStock', render: (text) => text > 0 ? <Tag color="success">{text} in stock</Tag> : <Tag color="error">Out of stock</Tag> },
                  { title: 'Tag', dataIndex: 'tag', key: 'tag', render: (text) => text ? <Tag color="blue">{text}</Tag> : '-' },
                  { 
                     title: 'Actions', 
                     key: 'actions', 
                     render: (_, record: any) => (
                        <Popconfirm 
                           title="Are you sure you want to delete this product?" 
                           onConfirm={() => handleDeleteProduct(record._id)}
                           okText="Yes, delete"
                           cancelText="No"
                           okButtonProps={{ danger: true }}
                        >
                           <Button type="text" danger icon={<Trash2 size={16} />} />
                        </Popconfirm>
                     )
                  },
               ]}
            />
         </TabPane>
         
         <TabPane tab="All Orders" key="2">
            <Table 
               dataSource={data.orders} 
               rowKey="_id"
               loading={loading}
               columns={[
                  { 
                     title: 'Product', 
                     key: 'product', 
                     render: (_, record: any) => {
                        const item = record.orderItems?.[0];
                        if (!item) return 'N/A';
                        return (
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {item.product?.image ? <img src={item.product?.image} alt={item.product?.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} /> : null}
                              <span style={{ fontWeight: 500 }}>{item.product?.name || 'Smart Pet Belt'}</span>
                           </div>
                        );
                     }
                  },
                  { title: 'Customer', key: 'user', render: (_, record: any) => record.user?.name || 'Unknown' },
                  { title: 'Quantity', key: 'qty', render: (_, record: any) => record.orderItems?.[0]?.qty || 1 },
                  { title: 'Amount', dataIndex: 'totalPrice', key: 'total', render: (text) => `$${text.toFixed(2)}` },
                  { title: 'Payment', dataIndex: 'isPaid', key: 'payment', render: (isPaid) => isPaid ? <Tag color="success">Paid</Tag> : <Tag color="warning">Pending</Tag> },
                  { 
                      title: 'Shipping', 
                      key: 'shippingStatus',
                      render: (_, record: any) => (
                           <Select 
                               defaultValue={record.shippingStatus || 'Processing'} 
                               style={{ width: 120 }}
                               onChange={(val) => handleUpdateShippingStatus(record._id, val)}
                               disabled={record.shippingStatus === 'Cancelled'}
                           >
                               <Select.Option value="Processing">Processing</Select.Option>
                               <Select.Option value="Shipped">Shipped</Select.Option>
                               <Select.Option value="Delivered">Delivered</Select.Option>
                               <Select.Option value="Cancelled">Cancelled</Select.Option>
                           </Select>
                      )
                  },
                  { title: 'Est. Delivery Date', dataIndex: 'createdAt', key: 'date', render: (text, record: any) => {
                      if (record.shippingStatus === 'Cancelled') return <Tag color="error">Cancelled</Tag>;
                      const d = new Date(text);
                      d.setDate(d.getDate() + 5);
                      return d.toLocaleDateString();
                  } },
               ]}
            />
         </TabPane>
      </Tabs>

      <Modal 
         title="Add New Product"
         open={isProductModalOpen} 
         onCancel={() => setIsProductModalOpen(false)}
         footer={null}
      >
         <Form form={form} layout="vertical" onFinish={handleCreateProduct}>
            <Form.Item label="Product Name" name="name" rules={[{ required: true }]}>
               <Input placeholder="E.g., PetSafety Smart Belt V2" />
            </Form.Item>
            <Form.Item label="Price ($)" name="price" rules={[{ required: true }]}>
               <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
            </Form.Item>
             <Form.Item label="Stock Count" name="countInStock" rules={[{ required: true }]}>
               <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item label="Product Tag (Optional)" name="tag">
               <Select placeholder="Select a tag" allowClear>
                   <Select.Option value="Best Seller">Best Seller</Select.Option>
                   <Select.Option value="Popular">Popular</Select.Option>
                   <Select.Option value="New Arrival">New Arrival</Select.Option>
                   <Select.Option value="Premium">Premium</Select.Option>
               </Select>
            </Form.Item>
            <Form.Item label="Product Image" name="image" valuePropName="fileList" getValueFromEvent={(e) => {
               if (Array.isArray(e)) return e;
               return e && e.fileList;
            }} rules={[{ required: true, message: 'Please upload an image' }]}>
               <Upload
                  name="file"
                  beforeUpload={() => false}
                  maxCount={1}
                  listType="picture"
               >
                  <Button icon={<UploadIcon size={16} />} style={{ width: '100%' }}>Click to Upload</Button>
               </Upload>
            </Form.Item>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
               <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
               <Button type="primary" htmlType="submit" block loading={loading}>
                  Create Product
               </Button>
            </Form.Item>
         </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
