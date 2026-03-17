import { useState, useEffect, useContext } from 'react';
import { Card, Typography, Spin, Button, Divider, message, Row, Col, Alert, Tag, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, MapPin, Phone, User as UserIcon } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const { Title, Paragraph } = Typography;

const AdoptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/adoptions/${id}`);
        setPost(data);
      } catch (error) {
        message.error('Failed to load adoption details');
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleRequestAdoption = async () => {
    if (!user) {
        navigate('/login');
        return;
    }
    
    setRequestLoading(true);
    try {
        await api.post(`/adoptions/${id}/request`);
        message.success('Adoption request sent successfully!');
        setIsModalOpen(false);
    } catch (error: any) {
        message.error(error.response?.data?.message || 'Failed to send request');
    }
    setRequestLoading(false);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}><Spin size="large" /></div>;
  if (!post) return <div>Post Not Found</div>;

  return (
    <div className="page-container" style={{ padding: '40px 24px' }}>
      <Button type="link" onClick={() => navigate('/adoption')} style={{ marginBottom: '24px' }}>
         &larr; Back to Adoption Board
      </Button>
      
      <Card bordered={false} style={{ padding: '24px', borderRadius: '16px' }}>
         <Row gutter={[48, 48]}>
            <Col xs={24} md={12}>
               <img src={post.photo} alt={post.petName} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '500px' }} />
            </Col>
            
            <Col xs={24} md={12}>
               <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                     <Title level={1} style={{ margin: 0, fontWeight: 800 }}>{post.petName}</Title>
                     {post.isAdopted ? <Tag color="success">Adopted</Tag> : <Tag color="processing">Available</Tag>}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                     <Tag color="purple">{post.animalType}</Tag>
                     <Tag color="cyan">{post.breed}</Tag>
                     <Tag color="orange">{post.age}</Tag>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', marginBottom: '24px', fontSize: '16px' }}>
                     <MapPin size={20} color="#0d9489" />
                     {post.location}
                  </div>
                  
                  <Divider />
                  
                  <Title level={4}>About {post.petName}</Title>
                  <Paragraph style={{ fontSize: '16px', color: '#4b5563', lineHeight: 1.6, marginBottom: '32px' }}>
                     {post.description}
                  </Paragraph>

                  {/* Owner Info Box */}
                  <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
                     <Title level={5} style={{ marginBottom: '16px' }}>Contact Owner</Title>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <UserIcon size={20} color="#6b7280" />
                            <span style={{ fontWeight: 500 }}>{post.owner?.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Phone size={20} color="#6b7280" />
                            <span style={{ color: '#4b5563' }}>{post.owner?.phone}</span>
                        </div>
                     </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                     <Button 
                       type="primary" 
                       size="large" 
                       disabled={post.isAdopted || post.owner?._id === user?._id}
                       onClick={() => setIsModalOpen(true)}
                       icon={<Heart size={20} />}
                       style={{ height: '56px', fontSize: '18px', fontWeight: 600, flex: 1 }}
                     >
                       {post.isAdopted ? 'Already Adopted' : 'Adopt Pet'}
                     </Button>
                     
                     <Button 
                       size="large" 
                       icon={<Phone size={20} />} 
                       href={`tel:${post.owner?.phone}`}
                       style={{ height: '56px', fontSize: '16px', fontWeight: 500, padding: '0 24px' }}
                     >
                       Call Owner
                     </Button>
                  </div>
               </div>
            </Col>
         </Row>
      </Card>

      <Modal 
        title="Send Adoption Request" 
        open={isModalOpen} 
        onOk={handleRequestAdoption} 
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={requestLoading}
        okText="Confirm Request"
      >
        <Paragraph>
            Are you sure you want to send an adoption request for <strong>{post.petName}</strong>? 
            The owner will be notified and will review your profile and contact information.
        </Paragraph>
        {user && (
            <Alert 
               type="info" 
               message="Your shared information" 
               description={`Name: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}`} 
               style={{ whiteSpace: 'pre-wrap' }}
            />
        )}
      </Modal>
    </div>
  );
};

export default AdoptionDetails;
