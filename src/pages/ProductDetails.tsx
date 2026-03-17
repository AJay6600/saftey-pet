import { useState, useEffect } from 'react';
import { Card, Typography, Spin, Button, Divider, message, Row, Col, Alert } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, Heart, RefreshCcw } from 'lucide-react';
import api from '../api/axios';

const { Title, Paragraph } = Typography;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/shop/products/${id}`);
        setProduct(data);
      } catch (error) {
        message.error('Failed to load product');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    navigate(`/checkout?product=${id}&qty=1`);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      message.success('Added to wishlist!');
    } else {
      message.info('Removed from wishlist');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}><Spin size="large" /></div>;
  if (!product) return <div>Product Not Found</div>;

  return (
    <div className="page-container" style={{ padding: '40px 24px' }}>
      <Button type="link" onClick={() => navigate('/store')} style={{ marginBottom: '24px' }}>
         &larr; Back to Store
      </Button>
      
      <Card bordered={false} style={{ padding: '24px', borderRadius: '16px' }}>
         <Row gutter={[48, 48]}>
            <Col xs={24} md={10}>
               <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} />
            </Col>
            
            <Col xs={24} md={14}>
               <div>
                  <Title level={1} style={{ margin: 0, fontWeight: 800 }}>{product.name}</Title>
                  <Title level={2} style={{ color: '#0d9489', fontWeight: 600, marginTop: '16px' }}>
                     ${product.price.toFixed(2)}
                  </Title>
                  
                  <Divider />
                  
                  <Paragraph style={{ fontSize: '18px', color: '#4b5563', lineHeight: 1.6 }}>
                     {product.description}
                  </Paragraph>

                  {product.countInStock > 0 ? (
                     <Alert message={`In Stock (${product.countInStock} available)`} type="success" showIcon style={{ marginBottom: '24px', maxWidth: '300px' }} />
                  ) : (
                     <Alert message="Out of Stock" type="error" showIcon style={{ marginBottom: '24px', maxWidth: '300px' }} />
                  )}

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                     <Button 
                       type="primary" 
                       size="large" 
                       disabled={product.countInStock === 0} 
                       onClick={addToCartHandler}
                       icon={<ShoppingCart size={20} />}
                       style={{ minWidth: '200px', height: '56px', fontSize: '18px', fontWeight: 600 }}
                     >
                       Buy Now
                     </Button>
                     <Button 
                       size="large" 
                       onClick={toggleLike}
                       icon={<Heart size={20} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "currentColor"} />} 
                       style={{ 
                         width: '56px', 
                         height: '56px', 
                         display: 'flex', 
                         alignItems: 'center', 
                         justifyContent: 'center',
                         borderColor: isLiked ? '#ef4444' : undefined,
                         backgroundColor: isLiked ? '#fef2f2' : undefined
                       }} 
                     />
                  </div>
                  
                  <Divider />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6b7280' }}>
                        <RefreshCcw size={20} />
                        <span>30-Day Hassle-Free Returns</span>
                     </div>
                  </div>
               </div>
            </Col>
         </Row>
      </Card>
    </div>
  );
};

export default ProductDetails;
