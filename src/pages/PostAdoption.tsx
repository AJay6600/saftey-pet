import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon } from 'lucide-react';
import api, { API_BASE_URL } from '../api/axios';

const { Title, Paragraph } = Typography;

const PostAdoption = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      let photoUrl = 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80';
      if (values.photo && Array.isArray(values.photo) && values.photo.length > 0) {
          const file = values.photo[0].originFileObj;
          if (file) {
              const formData = new FormData();
              formData.append('image', file);
              const res = await api.post('/upload', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
              });
              photoUrl = res.data.image.startsWith('http') ? res.data.image : `${API_BASE_URL}${res.data.image}`;
          }
      }

      const requestData = {
          ...values,
          photo: photoUrl,
      }
      
      const { data } = await api.post('/adoptions', requestData);
      message.success('Pet posted for adoption successfully!');
      navigate(`/adoption/${data._id}`);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to post pet');
    }
    setLoading(false);
  };

  return (
    <div className="page-container" style={{ padding: '40px 24px' }}>
      <Card style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', borderRadius: '16px' }}>
        <Title level={2} className="text-center" style={{ marginBottom: '8px' }}>Post a Pet for Adoption</Title>
        <Paragraph className="text-center" style={{ color: '#6b7280', marginBottom: '32px' }}>
          Provide details about the pet to help them find a loving new home.
        </Paragraph>
        
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
             <Col xs={24} md={12}>
                <Form.Item label="Pet Name" name="petName" rules={[{ required: true }]}>
                   <Input size="large" placeholder="Max" />
                </Form.Item>
             </Col>
             <Col xs={24} md={12}>
                <Form.Item label="Animal Type" name="animalType" rules={[{ required: true }]}>
                   <Input size="large" placeholder="Dog, Cat, etc." />
                </Form.Item>
             </Col>
          </Row>
          
          <Row gutter={24}>
             <Col xs={24} md={12}>
                <Form.Item label="Breed" name="breed" rules={[{ required: true }]}>
                   <Input size="large" placeholder="Labrador Mix" />
                </Form.Item>
             </Col>
             <Col xs={24} md={12}>
                <Form.Item label="Age" name="age" rules={[{ required: true }]}>
                   <Input size="large" placeholder="2 Years, 3 Months, etc." />
                </Form.Item>
             </Col>
          </Row>

          <Form.Item label="Location" name="location" rules={[{ required: true }]}>
             <Input size="large" placeholder="City, State" />
          </Form.Item>

          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
             <Input.TextArea placeholder="Describe the pet's personality, medical history, behavioral traits, etc." autoSize={{ minRows: 4, maxRows: 8 }} size="large" />
          </Form.Item>

          <Form.Item label="Pet Photo (Optional)" name="photo" valuePropName="fileList" getValueFromEvent={(e) => {
             if (Array.isArray(e)) return e;
             return e && e.fileList;
          }}>
             <Upload name="file" beforeUpload={() => false} maxCount={1} listType="picture">
                <Button icon={<UploadIcon size={16} />}>Click to Upload Photo</Button>
             </Upload>
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <Button size="large" onClick={() => navigate(-1)} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ flex: 2 }}>
                Publish Adoption Post
              </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default PostAdoption;
