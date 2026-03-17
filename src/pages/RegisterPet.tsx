import { useState, useContext } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider, Alert, Upload, Row, Col, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { AuthContext } from '../context/AuthContext';
import api, { API_BASE_URL } from '../api/axios';
import { ShoppingBag, Upload as UploadIcon, Download } from 'lucide-react';

const { Title, Paragraph } = Typography;

const RegisterPet = () => {
  const [loading, setLoading] = useState(false);
  const [generatedQRData, setGeneratedQRData] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
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
              const { data } = await api.post('/upload', formData, {
                 headers: {
                    'Content-Type': 'multipart/form-data',
                 },
              });
              // data.image holds the path to image like /uploads/image-123.jpg
              photoUrl = `${API_BASE_URL}${data.image}`;
          }
      }

      // Create a payload that strictly contains the data, NOT a URL link.
      // This ensures scanning shows info directly.
      const qrPayload = JSON.stringify({
         Owner: {
             Name: user?.name,
             Phone: user?.phone,
             Email: user?.email,
             Address: user?.address
         },
         Pet: {
             Name: values.petName,
             Type: values.animalType,
             Breed: values.breed,
         }
      }, null, 2);

      const requestData = {
          ...values,
          photo: photoUrl,
          qrData: qrPayload
      }
      
      await api.post('/pets', requestData);
      
      setGeneratedQRData(qrPayload);
      message.success('Pet registered securely!');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('success-qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `Pet_SafetyQR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="page-container" style={{ padding: '40px 24px' }}>
      {!generatedQRData ? (
        <Card style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
          <Title level={2} className="text-center">Register a Pet</Title>
          <Paragraph className="text-center" style={{ color: '#6b7280', marginBottom: '24px' }}>
            Enter your pet's details. A smart QR code will be generated to keep them safe.
          </Paragraph>
          
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Pet Name" name="petName" rules={[{ required: true }]}>
              <Input size="large" placeholder="Buddy" />
            </Form.Item>
            
            <Form.Item label="Animal Type" name="animalType" rules={[{ required: true }]}>
               <Input size="large" placeholder="Dog, Cat, etc." />
            </Form.Item>

            <Form.Item label="Breed (Optional)" name="breed">
               <Input size="large" placeholder="Golden Retriever" />
            </Form.Item>
            
            <Form.Item label="Pet Photo (Optional)" name="photo" valuePropName="fileList" getValueFromEvent={(e) => {
               if (Array.isArray(e)) return e;
               return e && e.fileList;
            }}>
               <Upload
                  name="file"
                  beforeUpload={() => false}
                  maxCount={1}
                  listType="picture"
               >
                  <Button icon={<UploadIcon size={16} />} size="large">Click to Upload</Button>
               </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full" size="large" loading={loading}>
                Generate Pet QR Tag
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Card className="qr-card-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', borderRadius: '16px' }}>
          <Title level={3} style={{ color: '#10B981', textAlign: 'center' }}>Registration Complete!</Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: '32px', color: '#6b7280' }}>
             Your pet's smart QR tag is ready. Below is the generated code containing your direct contact information.
          </Paragraph>
          
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                  <QRCodeCanvas id="success-qr-canvas" value={generatedQRData} size={250} level="H" includeMargin={true} />
               </div>
               
               <Space size="middle" direction="vertical" style={{ width: '100%', maxWidth: '250px' }}>
                  <Button type="primary" size="large" icon={<Download size={18} />} onClick={handleDownloadQR} block style={{ height: '48px', fontWeight: 500 }}>
                     Download QR
                  </Button>
                  <Button size="large" onClick={() => navigate('/dashboard')} block style={{ height: '48px', fontWeight: 500 }}>
                     Go to My Pets
                  </Button>
               </Space>
            </Col>
            
            <Col xs={24} md={12}>
               <Alert
                  message="How it works"
                  description="This QR code directly embeds your phone number, email, and pet details. It does not blindly link to a website, ensuring instant offline access for whoever scans it."
                  type="info"
                  showIcon
                  style={{ marginBottom: '24px', borderRadius: '8px' }}
               />
               
               <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <ShoppingBag size={32} color="#0d9489" style={{ marginBottom: '16px' }} />
                  <Title level={5}>Attach this QR code to a smart belt</Title>
                  <Paragraph style={{ color: '#6b7280', marginBottom: '24px' }}>
                     Ensure anyone who finds your pet can immediately scan them. Buy a custom engraved pet collar from our store.
                  </Paragraph>
                  <Button type="primary" size="large" onClick={() => navigate('/store')} block style={{ height: '48px', backgroundColor: '#111827', borderColor: '#111827' }}>
                     Shop Pet Belts
                  </Button>
               </div>
            </Col>
          </Row>
          
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
             <Divider />
             <Button type="text" onClick={() => setGeneratedQRData(null)} style={{ color: '#6b7280' }}>
               Register Another Pet Instead
             </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RegisterPet;
