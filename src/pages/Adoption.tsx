import { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Spin, Button, Tag, Avatar, Select, Input, Space } from 'antd';
import { Heart, MapPin, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const { Title, Paragraph } = Typography;

interface AdoptionPost {
  _id: string;
  petName: string;
  animalType: string;
  breed: string;
  location: string;
  photo: string;
  owner: { name: string; email: string };
  isAdopted: boolean;
}

const Adoption = () => {
  const [posts, setPosts] = useState<AdoptionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/adoptions');
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}><Spin size="large" /></div>;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid #e5e7eb', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
         <div>
            <Title level={2} style={{ margin: 0 }}>Pet Adoption</Title>
            <Paragraph style={{ color: '#6b7280', margin: '8px 0 0 0' }}>
               Find a new furry family member or help a pet find a loving home.
            </Paragraph>
         </div>
         <Space wrap>
            <Input.Search 
              placeholder="Search by breed or location" 
              allowClear 
              onChange={(e) => setSearchQuery(e.target.value)} 
              style={{ width: 220 }} 
            />
            <Select defaultValue="All" style={{ width: 140 }} onChange={setFilterType}>
              <Select.Option value="All">All Animals</Select.Option>
              <Select.Option value="Dog">Dogs</Select.Option>
              <Select.Option value="Cat">Cats</Select.Option>
              <Select.Option value="Other">Others</Select.Option>
            </Select>
            <Button type="primary" size="large" icon={<Heart size={18} />} onClick={() => navigate('/adoption/post')}>
               Post a Pet
            </Button>
         </Space>
      </div>

      <Row gutter={[24, 24]}>
        {posts
          .filter(post => filterType === 'All' || post.animalType === filterType)
          .filter(post => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (
              post.breed?.toLowerCase().includes(q) || 
              post.location?.toLowerCase().includes(q) ||
              post.petName?.toLowerCase().includes(q)
            );
          })
          .map((post) => (
          <Col xs={24} sm={12} md={8} lg={6} key={post._id}>
            <Link to={`/adoption/${post._id}`}>
              <Card
                hoverable
                cover={<img alt={post.petName} src={post.photo} style={{ height: '240px', objectFit: 'cover' }} />}
                style={{ borderRadius: '12px', overflow: 'hidden' }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                   <Title level={4} style={{ margin: 0 }}>{post.petName}</Title>
                   {post.isAdopted ? <Tag color="success">Adopted</Tag> : <Tag color="processing">Available</Tag>}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', marginBottom: '8px' }}>
                   <Tag style={{ margin: 0 }}>{post.animalType}</Tag>
                   <Tag style={{ margin: 0 }}>{post.breed}</Tag>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', marginBottom: '16px' }}>
                   <MapPin size={16} />
                   <span style={{ fontSize: '14px' }}>{post.location}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                   <Avatar icon={<UserIcon size={16} />} size="small" style={{ backgroundColor: '#0d9489' }} />
                   <span style={{ fontSize: '14px', color: '#4b5563' }}>{post.owner?.name}</span>
                </div>
              </Card>
            </Link>
          </Col>
        ))}
        {posts.length === 0 && (
           <Col span={24}>
              <div style={{ textAlign: 'center', padding: '64px 0', color: '#6b7280' }}>
                 No pets currently available for adoption. Check back later!
              </div>
           </Col>
        )}
      </Row>
    </div>
  );
};

export default Adoption;
