import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Mail, Lock, User, Phone } from 'lucide-react';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { data } = await api.post('/users', values);
      login(data, data.token);
      message.success('Registration successful');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container" style={{ padding: '40px 0' }}>
      <Card style={{ width: '100%', maxWidth: '440px', padding: '24px' }} bordered={false}>
        <div className="text-center mb-4">
           <Title level={2}>Create an Account</Title>
           <p style={{ color: '#6b7280' }}>Join PetSafety to protect and care for pets.</p>
        </div>
        
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
            <Input prefix={<User size={16} color="#9ca3af" />} placeholder="John Doe" size="large" />
          </Form.Item>

          <Form.Item label="Email Address" name="email" rules={[{ required: true }, { type: 'email' }]}>
            <Input prefix={<Mail size={16} color="#9ca3af" />} placeholder="john@example.com" size="large" />
          </Form.Item>

          <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
            <Input prefix={<Phone size={16} color="#9ca3af" />} placeholder="+1 234 567 890" size="large" />
          </Form.Item>

          <Form.Item label="Physical Address" name="address" rules={[{ required: true }]}>
             <Input.TextArea placeholder="123 Main St, City, Country" autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password prefix={<Lock size={16} color="#9ca3af" />} placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" size="large" loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-4">
          <span style={{ color: '#6b7280' }}>Already have an account? </span>
          <Link to="/login" style={{ fontWeight: 600 }}>Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
