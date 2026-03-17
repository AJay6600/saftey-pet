import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message, Divider, Spin, Alert } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const { Title, Paragraph } = Typography;

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('product');

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const { data } = await api.get(`/shop/products/${productId}`);
          setProductData(data);
        } catch (error) {
          message.error('Product not found for checkout');
          navigate('/store');
        }
      };
      fetchProduct();
    }
  }, [productId, navigate]);

  const onFinish = async () => {
    setLoading(true);
    // Simulate payment delay
    setTimeout(async () => {
       try {
          await api.post('/shop/orders', {
             orderItems: [
                {
                   product: productId,
                   qty: 1,
                   price: productData.price
                }
             ],
             totalPrice: productData.price
          });

          setIsSuccess(true);
       } catch (error: any) {
          message.error('Checkout failed');
       }
       setLoading(false);
    }, 1500);
  };

  if (!productData) return <div style={{ textAlign: 'center', marginTop: '100px' }}><Spin size="large" /></div>;

  if (isSuccess) {
     return (
        <div className="page-container" style={{ textAlign: 'center', padding: '80px 24px' }}>
           <CheckCircle size={64} color="#10B981" style={{ margin: '0 auto 24px auto' }} />
           <Title level={2}>Order Confirmed!</Title>
           <Paragraph style={{ color: '#6b7280', maxWidth: '400px', margin: '0 auto 24px auto' }}>
              Your dummy payment was successful. We're getting your smart pet belt ready for shipment.
           </Paragraph>
           <Button type="primary" size="large" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
           </Button>
        </div>
     );
  }

  return (
    <div className="page-container" style={{ padding: '40px 24px' }}>
      <Button type="link" onClick={() => navigate(-1)} style={{ marginBottom: '24px' }}>
         &larr; Back
      </Button>

      <Row gutter={48}>
         {/* Checkout Form */}
         <Col xs={24} md={14}>
            <Card bordered={false} style={{ borderRadius: '12px', padding: '16px' }}>
               <Title level={3} style={{ marginBottom: '24px' }}>Payment Details</Title>
               <Alert message="This is a simulated checkout. No real money will be charged." type="info" showIcon style={{ marginBottom: '24px' }} />
               
               <Form layout="vertical" onFinish={onFinish}>
                  <Form.Item label="Name on Card" rules={[{ required: true }]}>
                    <Input size="large" placeholder="John Doe" />
                  </Form.Item>
                  <Form.Item label="Card Number" rules={[{ required: true }]}>
                    <Input prefix={<CreditCard size={18} color="#9ca3af" />} size="large" placeholder="0000 0000 0000 0000" maxLength={19} />
                  </Form.Item>
                  <Row gutter={16}>
                     <Col span={12}>
                        <Form.Item label="Expiry Date" rules={[{ required: true }]}>
                           <Input size="large" placeholder="MM/YY" />
                        </Form.Item>
                     </Col>
                     <Col span={12}>
                        <Form.Item label="CVV" rules={[{ required: true }]}>
                           <Input.Password size="large" placeholder="123" maxLength={4} />
                        </Form.Item>
                     </Col>
                  </Row>
                  
                  <Divider />
                  <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ height: '56px', fontSize: '18px' }}>
                     Pay ${productData.price.toFixed(2)}
                  </Button>
               </Form>
            </Card>
         </Col>
         
         {/* Order Summary */}
         <Col xs={24} md={10}>
             <Card bordered={false} style={{ borderRadius: '12px', padding: '16px', backgroundColor: '#F9FAFB' }}>
                <Title level={4} style={{ marginBottom: '24px' }}>Order Summary</Title>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                   <img src={productData.image} alt={productData.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                   <div>
                      <p style={{ fontWeight: 600, margin: 0 }}>{productData.name}</p>
                      <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Qty: 1</p>
                      <p style={{ fontWeight: 600, color: '#0d9489', margin: '4px 0 0 0' }}>${productData.price.toFixed(2)}</p>
                   </div>
                </div>
                
                <Divider />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                   <span style={{ color: '#6b7280' }}>Subtotal</span>
                   <span style={{ fontWeight: 500 }}>${productData.price.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                   <span style={{ color: '#6b7280' }}>Shipping</span>
                   <span style={{ fontWeight: 500 }}>Free</span>
                </div>
                
                <Divider />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 700 }}>
                   <span>Total</span>
                   <span style={{ color: '#0d9489' }}>${productData.price.toFixed(2)}</span>
                </div>
             </Card>
         </Col>
      </Row>
    </div>
  );
};

export default Checkout;
