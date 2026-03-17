import { Typography, Row, Col, Card, Button, List, Empty, Divider, Space } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Empty 
          image={<ShoppingCartOutlined style={{ fontSize: '80px', color: '#e5e7eb' }} />}
          description={<Title level={3} style={{ marginTop: '20px' }}>Your cart is empty</Title>}
        >
          <Paragraph style={{ color: '#6b7280', margin: '10px auto 30px', maxWidth: '400px' }}>
             Looks like you haven't added any smart QR pet belts to your cart yet.
          </Paragraph>
          <Button type="primary" size="large" onClick={() => navigate('/store')}>
             Continue Shopping
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Title level={2} style={{ marginBottom: '32px' }}>Shopping Cart</Title>

      <Row gutter={40}>
        <Col xs={24} lg={16}>
          <Card bordered={false} style={{ borderRadius: '12px' }}>
            <List
              itemLayout="horizontal"
              dataSource={items}
              renderItem={({ product, quantity }) => (
                <List.Item
                  actions={[
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => removeFromCart(product.id || (product as any)._id)}
                    >
                      Remove
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<img src={product.image} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
                    title={<span style={{ fontSize: '18px', fontWeight: 600 }}>{product.name}</span>}
                    description={
                      <div style={{ marginTop: '8px' }}>
                        <Title level={5} style={{ color: '#0d9489', margin: 0 }}>${product.price.toFixed(2)}</Title>
                        <Space style={{ marginTop: '12px' }}>
                          <Button size="small" onClick={() => updateQuantity(product.id || (product as any)._id, quantity - 1)}>-</Button>
                          <Text style={{ margin: '0 8px' }}>{quantity}</Text>
                          <Button size="small" onClick={() => updateQuantity(product.id || (product as any)._id, quantity + 1)}>+</Button>
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ borderRadius: '12px', background: '#f8fafc' }}>
            <Title level={4}>Order Summary</Title>
            <Divider />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
               <Text>Subtotal</Text>
               <Text strong>${totalPrice.toFixed(2)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
               <Text>Shipping</Text>
               <Text strong style={{ color: '#22c55e' }}>Free</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
               <Text>Tax</Text>
               <Text strong>$0.00</Text>
            </div>
            
            <Divider />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
               <Title level={3} style={{ margin: 0 }}>Total</Title>
               <Title level={3} style={{ margin: 0, color: '#0d9489' }}>${totalPrice.toFixed(2)}</Title>
            </div>

            <Button 
               type="primary" 
               size="large" 
               block 
               icon={<CreditCardOutlined />}
               onClick={() => navigate('/checkout', { state: { product: items[0]?.product, quantity: items[0]?.quantity } })}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;
