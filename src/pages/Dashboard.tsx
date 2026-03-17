import { useState, useEffect, useContext } from 'react';
import { Typography, Tabs, Card, Spin, Table, Tag, Button, Modal, Form, Input, Upload, message, Popconfirm } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Upload as UploadIcon, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import api, { API_BASE_URL } from '../api/axios';

const { Title } = Typography;
const { TabPane } = Tabs;

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    pets: [],
    orders: [],
    myAdoptionPosts: [],
    receivedRequests: [],
    sentRequests: []
  });
  
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [isEditingPet, setIsEditingPet] = useState(false);
  const [petForm] = Form.useForm();

  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);
  const [selectedAdoption, setSelectedAdoption] = useState<any>(null);
  const [adoptionForm] = Form.useForm();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [petsRes, ordersRes, adoptionRes, sentReqsRes, receivedReqsRes] = await Promise.all([
          api.get('/pets/my-pets'),
          api.get('/shop/orders/myorders'),
          api.get('/adoptions'), // Getting all and filtering below, or create specific endpoint
          api.get('/adoptions/sent-requests'),
          api.get('/adoptions/my-requests')
        ]);
        
        setData({
           pets: petsRes.data,
           orders: ordersRes.data,
           myAdoptionPosts: adoptionRes.data.filter((post: any) => post.owner?._id === user?._id),
           sentRequests: sentReqsRes.data,
           receivedRequests: receivedReqsRes.data
        });
      } catch (error) {
        console.error('Failed to load dashboard data');
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  const handleStatusUpdate = async (requestId: string, status: string) => {
     try {
         await api.put(`/adoptions/requests/${requestId}`, { status });
         const receivedReqsRes = await api.get('/adoptions/my-requests');
         setData(prev => ({ ...prev, receivedRequests: receivedReqsRes.data }));
     } catch (error) {
         console.error('Status update failed');
     }
  };

  const handleCancelOrder = async (orderId: string) => {
     try {
         await api.put(`/shop/orders/${orderId}/cancel`);
         message.success('Order cancelled successfully');
         const ordersRes = await api.get('/shop/orders/myorders');
         setData(prev => ({ ...prev, orders: ordersRes.data }));
     } catch (error: any) {
         message.error(error.response?.data?.message || 'Failed to cancel order');
     }
  };

  const handleCancelRequest = async (requestId: string) => {
      try {
          await api.delete(`/adoptions/requests/${requestId}`);
          message.success('Adoption request cancelled');
          const sentReqsRes = await api.get('/adoptions/sent-requests');
          setData(prev => ({ ...prev, sentRequests: sentReqsRes.data }));
      } catch (error: any) {
          message.error(error.response?.data?.message || 'Failed to cancel request');
      }
  };

  const openPetDetails = (pet: any) => {
    setSelectedPet(pet);
    setIsEditingPet(false);
    // Don't inject string 'photo' into Upload field or it crashes React
    petForm.setFieldsValue({ ...pet, photo: undefined });
    setIsPetModalOpen(true);
  };

  const handleUpdatePet = async (values: any) => {
    try {
      let photoUrl = selectedPet.photo; // default to old photo
      if (values.photo && Array.isArray(values.photo) && values.photo.length > 0) {
          const file = values.photo[0].originFileObj;
          if (file) {
              const formData = new FormData();
              formData.append('image', file);
              const { data } = await api.post('/upload', formData, {
                 headers: { 'Content-Type': 'multipart/form-data' },
              });
              photoUrl = `${API_BASE_URL}${data.image}`;
          }
      }

      const requestData = {
          ...values,
          photo: photoUrl
      };

      await api.put(`/pets/${selectedPet._id}`, requestData);
      message.success('Pet updated successfully!');
      
      // refresh pets
      const petsRes = await api.get('/pets/my-pets');
      setData(prev => ({ ...prev, pets: petsRes.data }));
      
      setIsPetModalOpen(false);
    } catch (error) {
      message.error('Failed to update pet');
    }
  };

  const handleDeletePet = async (petId: string) => {
    try {
      await api.delete(`/pets/${petId}`);
      message.success('Pet removed');
      setData(prev => ({ ...prev, pets: prev.pets.filter((p: any) => p._id !== petId) }));
      setIsPetModalOpen(false);
    } catch (error) {
      message.error('Failed to delete pet');
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('pet-qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${selectedPet?.petName}_SafetyQR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleUpdateAdoptionPost = async (values: any) => {
      try {
          let photoUrl = selectedAdoption?.photo;
          if (values.photo && Array.isArray(values.photo) && values.photo.length > 0) {
              const file = values.photo[0].originFileObj;
              if (file) {
                  const formData = new FormData();
                  formData.append('image', file);
                  const { data } = await api.post('/upload', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' },
                  });
                  photoUrl = `${API_BASE_URL}${data.image}`;
              }
          }

          const requestData = { ...values, photo: photoUrl };
          await api.put(`/adoptions/${selectedAdoption._id}`, requestData);
          message.success('Adoption post updated!');

          const adoptionRes = await api.get('/adoptions');
          setData(prev => ({ 
              ...prev, 
              myAdoptionPosts: adoptionRes.data.filter((post: any) => post.owner?._id === user?._id) 
          }));
          setIsAdoptionModalOpen(false);
      } catch (error) {
          message.error('Failed to update adoption post');
      }
  };

  const handleDeleteAdoptionPost = async (postId: string) => {
      try {
          await api.delete(`/adoptions/${postId}`);
          message.success('Adoption post deleted');
          setData(prev => ({ 
              ...prev, 
              myAdoptionPosts: prev.myAdoptionPosts.filter((p: any) => p._id !== postId) 
          }));
          setIsAdoptionModalOpen(false);
      } catch (error) {
          message.error('Failed to delete adoption post');
      }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}><Spin size="large" /></div>;

  return (
    <div className="page-container" style={{ padding: '40px 24px' }}>
      <Title level={2} style={{ marginBottom: '32px' }}>Welcome, {user?.name}</Title>
      
      <Tabs defaultActiveKey="1" size="large">
         <TabPane tab="My Pets" key="1">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Button type="primary" icon={<Plus size={16} />} onClick={() => navigate('/register-pet')}>Register Pet</Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
               {data.pets.map((pet: any) => (
                  <Card 
                     key={pet._id} 
                     hoverable
                     onClick={() => openPetDetails(pet)}
                     actions={[
                        <Button type="text" icon={<Edit size={16} />} onClick={(e) => {
                           e.stopPropagation();
                           setSelectedPet(pet);
                           setIsEditingPet(true);
                           petForm.setFieldsValue({ ...pet, photo: undefined });
                           setIsPetModalOpen(true);
                        }}>Edit</Button>,
                        <Popconfirm 
                           title="Delete this pet?" 
                           onConfirm={(e) => { e?.stopPropagation(); handleDeletePet(pet._id); }}
                           onCancel={(e) => e?.stopPropagation()}
                        >
                           <Button type="text" danger icon={<Trash2 size={16} />} onClick={(e) => e.stopPropagation()}>Delete</Button>
                        </Popconfirm>
                     ]}
                  >
                     <Card.Meta 
                        avatar={<img src={pet.photo} alt={pet.petName} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />}
                        title={pet.petName}
                        description={`${pet.animalType} - ${pet.breed}`}
                     />
                  </Card>
               ))}
               {data.pets.length === 0 && <p>You haven't registered any pets yet.</p>}
            </div>
         </TabPane>
         
         <TabPane tab="My Orders" key="2">
            <Table 
               dataSource={data.orders} 
               rowKey="_id"
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
                  { title: 'Quantity', key: 'qty', render: (_, record: any) => record.orderItems?.[0]?.qty || 1 },
                  { title: 'Amount', dataIndex: 'totalPrice', key: 'total', render: (text) => `$${text.toFixed(2)}` },
                  { 
                     title: 'Status', 
                     key: 'status', 
                     render: (_, record: any) => {
                         if (!record.isPaid) return <Tag color="warning">Payment Pending</Tag>;
                         
                         let color = 'processing';
                         if (record.shippingStatus === 'Shipped') color = 'cyan';
                         if (record.shippingStatus === 'Delivered') color = 'success';
                         if (record.shippingStatus === 'Cancelled') color = 'error';

                         return <Tag color={color}>{record.shippingStatus || 'Processing'}</Tag>;
                     }
                  },
                  { title: 'Est. Delivery', dataIndex: 'createdAt', key: 'delivery', render: (text, record: any) => {
                      if (record.shippingStatus === 'Cancelled') return <Tag color="error">Cancelled</Tag>;
                      const d = new Date(text);
                      d.setDate(d.getDate() + 5);
                      return d.toLocaleDateString();
                  } },
                  {
                      title: 'Action',
                      key: 'action',
                      render: (_, record: any) => {
                          if (record.shippingStatus !== 'Delivered' && record.shippingStatus !== 'Cancelled') {
                              return (
                                  <Popconfirm
                                      title="Are you sure you want to cancel this order?"
                                      onConfirm={() => handleCancelOrder(record._id)}
                                      okText="Yes"
                                      cancelText="No"
                                  >
                                      <Button danger size="small">Cancel Order</Button>
                                  </Popconfirm>
                              );
                          }
                          return null;
                      }
                  }
               ]}
            />
         </TabPane>
         
         <TabPane tab="Adoption Requests Sent" key="3">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
               {data.sentRequests.map((req: any) => (
                  <Card key={req._id}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                           {req.post?.photo && <img src={req.post?.photo} alt={req.post?.petName} style={{ width: 60, height: 60, borderRadius: '8px', objectFit: 'cover' }} />}
                           <div>
                              <Title level={5} style={{ marginBottom: '4px' }}>Pet: {req.post?.petName}</Title>
                              <p style={{ margin: 0, color: '#6b7280' }}>{req.post?.animalType} • {req.post?.breed} • {req.post?.age}</p>
                           </div>
                        </div>
                        <Tag color={req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'error' : 'processing'}>
                           {req.status}
                        </Tag>
                     </div>
                     
                     <div style={{ background: '#F9FAFB', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 500 }}>Owner Details</p>
                        <p style={{ margin: 0, color: '#4b5563' }}>Name: {req.owner?.name}</p>
                        <p style={{ margin: 0, color: '#4b5563' }}>Email: {req.owner?.email}</p>
                        <p style={{ margin: 0, color: '#4b5563' }}>Phone: {req.owner?.phone}</p>
                        <p style={{ margin: 0, color: '#4b5563' }}>Address: {req.owner?.address}</p>
                     </div>

                     {req.status === 'Pending' && (
                        <Popconfirm
                           title="Are you sure you want to cancel this adoption request?"
                           onConfirm={() => handleCancelRequest(req._id)}
                           okText="Yes, Cancel"
                           cancelText="No"
                        >
                           <Button danger block>Cancel Request</Button>
                        </Popconfirm>
                     )}
                  </Card>
               ))}
               {data.sentRequests.length === 0 && <p>No adoption requests sent.</p>}
            </div>
         </TabPane>
         
         <TabPane tab="Adoption Requests Received" key="4">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
               {data.receivedRequests.map((req: any) => (
                  <Card key={req._id}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                           <Title level={5}>Target Pet: {req.post?.petName}</Title>
                           <p><strong>Requester:</strong> {req.requester?.name}</p>
                           <p><strong>Email:</strong> {req.requester?.email}</p>
                           <p><strong>Phone:</strong> {req.requester?.phone}</p>
                        </div>
                        <Tag color={req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'error' : 'processing'}>
                           {req.status}
                        </Tag>
                     </div>
                     {req.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                           <Button type="primary" size="small" onClick={() => handleStatusUpdate(req._id, 'Approved')}>Approve</Button>
                           <Button danger size="small" onClick={() => handleStatusUpdate(req._id, 'Rejected')}>Reject</Button>
                        </div>
                     )}
                  </Card>
               ))}
               {data.receivedRequests.length === 0 && <p>No adoption requests received.</p>}
            </div>
         </TabPane>
         
         <TabPane tab="My Adoption Posts" key="5">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Button type="primary" icon={<Plus size={16} />} onClick={() => navigate('/adoption/post')}>Post a Pet</Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
               {data.myAdoptionPosts.map((post: any) => (
                  <Card 
                    key={post._id} 
                    cover={<img src={post.photo} alt={post.petName} style={{ height: 150, objectFit: 'cover' }} />}
                    actions={[
                        <Button type="text" icon={<Edit size={16} />} onClick={() => {
                            setSelectedAdoption(post);
                            adoptionForm.setFieldsValue({ ...post, photo: undefined });
                            setIsAdoptionModalOpen(true);
                        }}>Edit</Button>,
                        <Popconfirm 
                            title="Delete this post?" 
                            onConfirm={() => handleDeleteAdoptionPost(post._id)}
                        >
                            <Button type="text" danger icon={<Trash2 size={16} />}>Delete</Button>
                        </Popconfirm>
                    ]}
                  >
                     <Card.Meta 
                        title={post.petName} 
                        description={post.isAdopted ? <Tag color="success">Adopted</Tag> : <Tag color="processing">Available</Tag>} 
                     />
                  </Card>
               ))}
               {data.myAdoptionPosts.length === 0 && <p>You haven't posted any pets for adoption.</p>}
            </div>
         </TabPane>
      </Tabs>

      <Modal 
         open={isPetModalOpen} 
         onCancel={() => setIsPetModalOpen(false)} 
         footer={null} 
         centered
         title={isEditingPet ? `Edit ${selectedPet?.petName}` : `Pet Details: ${selectedPet?.petName}`}
      >
         {selectedPet && (
            <div style={{ padding: '8px' }}>
               {!isEditingPet ? (
                  <div style={{ textAlign: 'center' }}>
                     <img src={selectedPet.photo} alt={selectedPet.petName} style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px auto', display: 'block' }} />
                     <Title level={4} style={{ marginBottom: 0 }}>{selectedPet.petName}</Title>
                     <p style={{ color: '#6b7280' }}>{selectedPet.animalType} - {selectedPet.breed}</p>
                     
                     <div style={{ margin: '24px 0', border: '1px solid #e5e7eb', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Title level={5} style={{ marginBottom: '16px' }}>Pet QR Tag</Title>
                        <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                           <QRCodeCanvas id="pet-qr-canvas" value={selectedPet.qrData} size={200} level="H" includeMargin={true} />
                        </div>
                        <Button type="default" icon={<Download size={16} />} onClick={handleDownloadQR}>
                           Download QR
                        </Button>
                     </div>

                     <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
                        <Button type="primary" icon={<Edit size={16} />} onClick={() => setIsEditingPet(true)}>
                           Edit Pet
                        </Button>
                        <Popconfirm 
                           title="Are you sure you want to delete this pet?" 
                           onConfirm={() => handleDeletePet(selectedPet._id)}
                           okText="Yes"
                           cancelText="No"
                           okButtonProps={{ danger: true }}
                        >
                           <Button danger icon={<Trash2 size={16} />}>Delete Pet</Button>
                        </Popconfirm>
                     </div>
                  </div>
               ) : (
                  <Form form={petForm} layout="vertical" onFinish={handleUpdatePet}>
                     <Form.Item label="Pet Name" name="petName" rules={[{ required: true }]}>
                        <Input />
                     </Form.Item>
                     <Form.Item label="Animal Type" name="animalType" rules={[{ required: true }]}>
                        <Input />
                     </Form.Item>
                     <Form.Item label="Breed" name="breed">
                        <Input />
                     </Form.Item>
                     <Form.Item label="Update Photo (Optional)" name="photo" valuePropName="fileList" getValueFromEvent={(e) => {
                        if (Array.isArray(e)) return e;
                        return e && e.fileList;
                     }}>
                        <Upload name="file" beforeUpload={() => false} maxCount={1} listType="picture">
                           <Button icon={<UploadIcon size={16} />}>Click to Upload New Photo</Button>
                        </Upload>
                     </Form.Item>
                     <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                        <Button onClick={() => setIsEditingPet(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Save Changes</Button>
                     </div>
                  </Form>
               )}
            </div>
         )}
      </Modal>

      <Modal 
         open={isAdoptionModalOpen} 
         onCancel={() => setIsAdoptionModalOpen(false)} 
         footer={null} 
         centered
         title={`Edit Adoption Post: ${selectedAdoption?.petName}`}
      >
         {selectedAdoption && (
            <Form form={adoptionForm} layout="vertical" onFinish={handleUpdateAdoptionPost}>
               <Form.Item label="Pet Name" name="petName" rules={[{ required: true }]}>
                  <Input />
               </Form.Item>
               <Form.Item label="Animal Type" name="animalType" rules={[{ required: true }]}>
                  <Input />
               </Form.Item>
               <Form.Item label="Breed" name="breed" rules={[{ required: true }]}>
                  <Input />
               </Form.Item>
               <Form.Item label="Age" name="age" rules={[{ required: true }]}>
                  <Input />
               </Form.Item>
               <Form.Item label="Location" name="location" rules={[{ required: true }]}>
                  <Input />
               </Form.Item>
               <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                  <Input.TextArea rows={4} />
               </Form.Item>
               <Form.Item label="Update Photo (Optional)" name="photo" valuePropName="fileList" getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e && e.fileList;
               }}>
                  <Upload name="file" beforeUpload={() => false} maxCount={1} listType="picture">
                     <Button icon={<UploadIcon size={16} />}>Click to Upload New Photo</Button>
                  </Upload>
               </Form.Item>
               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                  <Button onClick={() => setIsAdoptionModalOpen(false)}>Cancel</Button>
                  <Button type="primary" htmlType="submit">Save Changes</Button>
               </div>
            </Form>
         )}
      </Modal>
    </div>
  );
};

export default Dashboard;
