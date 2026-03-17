import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Mail, Lock } from 'lucide-react';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { data } = await api.post('/users/login', values);
      login(data, data.token);
      message.success('Login successful');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <Card style={{ width: '100%', maxWidth: '400px', padding: '24px' }} bordered={false}>
        <div className="text-center mb-4">
           <Title level={2}>Welcome Back</Title>
           <p style={{ color: '#6b7280' }}>Please enter your details to sign in.</p>
        </div>
        
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Valid email required' }]}
          >
            <Input prefix={<Mail size={16} color="#9ca3af" />} placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<Lock size={16} color="#9ca3af" />} placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" size="large" loading={loading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-4">
          <span style={{ color: '#6b7280' }}>Don't have an account? </span>
          <Link to="/register" style={{ fontWeight: 600 }}>Sign up</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
