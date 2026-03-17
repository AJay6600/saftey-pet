import { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Spin, Button, Tag, message, Select, Space } from 'antd';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const { Title, Paragraph } = Typography;

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  tag?: string;
}

const Store = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<string>('default');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/shop/products');
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}><Spin size="large" /></div>;

  return (
    <div className="page-container">
      <div style={{ padding: '24px 0', borderBottom: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
         <div>
           <Title level={2}>PetSafety Store</Title>
           <Paragraph style={{ color: '#6b7280', maxWidth: '600px', margin: 0 }}>
              Browse our premium selection of pet belts and collars. All products are designed to hold your custom smart QR tag securely.
           </Paragraph>
         </div>
         <Space>
           <Select defaultValue="All" style={{ width: 140 }} onChange={setFilterTag}>
             <Select.Option value="All">All Tags</Select.Option>
             <Select.Option value="Best Seller">Best Seller</Select.Option>
             <Select.Option value="Premium">Premium</Select.Option>
             <Select.Option value="New Arrival">New Arrival</Select.Option>
             <Select.Option value="Popular">Popular</Select.Option>
           </Select>
           <Select defaultValue="default" style={{ width: 180 }} onChange={setSortOrder}>
             <Select.Option value="default">Sort by: Default</Select.Option>
             <Select.Option value="priceAsc">Price: Low to High</Select.Option>
             <Select.Option value="priceDesc">Price: High to Low</Select.Option>
           </Select>
         </Space>
      </div>

      <Row gutter={[24, 24]}>
        {products
          .filter(p => filterTag === 'All' || p.tag === filterTag)
          .sort((a, b) => {
             if (sortOrder === 'priceAsc') return a.price - b.price;
             if (sortOrder === 'priceDesc') return b.price - a.price;
             return 0;
          })
          .map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Link to={`/store/product/${product._id}`}>
              <Card
                hoverable
                cover={
                  <div style={{ position: 'relative' }}>
                    {product.tag && (
                       <div style={{
                         position: 'absolute', top: 12, left: 12, zIndex: 1, 
                         backgroundColor: product.tag === 'Premium' ? '#8b5cf6' : product.tag === 'New Arrival' ? '#10b981' : product.tag === 'Best Seller' ? '#ef4444' : '#f97316', 
                         color: 'white', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600
                       }}>
                         {product.tag}
                       </div>
                    )}
                    <img alt={product.name} src={product.image} style={{ height: '240px', width: '100%', objectFit: 'cover' }} />
                  </div>
                }
                style={{ borderRadius: '12px', overflow: 'hidden' }}
                actions={[
                   <Button 
                     type="primary" 
                     icon={<ShoppingCart size={16} />} 
                     block 
                     style={{ margin: '0 8px', width: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                     onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       addToCart(product);
                       message.success('Added to cart');
                     }}
                   >Add to Cart</Button>
                ]}
              >
                <div style={{ marginBottom: '8px' }}>
                  {product.countInStock > 0 ? <Tag color="success">In Stock</Tag> : <Tag color="error">Out of Stock</Tag>}
                </div>
                <Title level={5} style={{ marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.name}
                </Title>
                <Title level={4} style={{ margin: 0, color: '#0d9489', fontWeight: 700 }}>
                  ${product.price.toFixed(2)}
                </Title>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Store;
