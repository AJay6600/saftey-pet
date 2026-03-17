import { Link } from 'react-router-dom';
import { Row, Col, Typography, Space } from 'antd';
import { PawPrint, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const { Title } = Typography;

export default function Footer() {
  return (
    <footer style={{ background: '#111827', color: '#f3f4f6', paddingTop: '60px', paddingBottom: '24px' }}>
      <style>{`
        .footer-link {
          color: #9CA3AF;
          text-decoration: none;
          transition: color 0.3s;
          cursor: pointer;
        }
        .footer-link:hover {
          color: #0d9489;
        }
        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s;
        }
        .social-icon:hover {
          background: #0d9489;
        }
      `}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Row gutter={[48, 32]}>
          <Col xs={24} sm={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ background: '#0d9489', borderRadius: '8px', padding: '6px', display: 'flex' }}>
                <PawPrint size={24} color="#fff" />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                Pet<span style={{ color: '#0d9489' }}>Safety</span>
              </span>
            </div>
            <p style={{ color: '#9CA3AF', marginBottom: '24px', fontSize: '15px', lineHeight: '1.6' }}>
              We are dedicated to keeping your furry friends safe with our innovative smart QR technology. Reunite with your lost pets faster than ever.
            </p>
            <Space size="middle">
              <div className="social-icon">
                <Facebook size={18} color="#fff" />
              </div>
              <div className="social-icon">
                <Twitter size={18} color="#fff" />
              </div>
              <div className="social-icon">
                <Instagram size={18} color="#fff" />
              </div>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Title level={4} style={{ color: '#fff', marginBottom: '24px', fontSize: '18px' }}>Quick Links</Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Link to="/store" className="footer-link">Store</Link>
              <Link to="/adoption" className="footer-link">Adoption</Link>
              <Link to="/register-pet" className="footer-link">Register Pet</Link>
              <Link to="/" className="footer-link">Home</Link>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Title level={4} style={{ color: '#fff', marginBottom: '24px', fontSize: '18px' }}>Legal</Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <span className="footer-link">Privacy Policy</span>
              <span className="footer-link">Terms of Service</span>
              <span className="footer-link">Cookie Policy</span>
            </Space>
          </Col>

          <Col xs={24} sm={24} md={6}>
            <Title level={4} style={{ color: '#fff', marginBottom: '24px', fontSize: '18px' }}>Contact Us</Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9CA3AF' }}>
                <MapPin size={18} color="#0d9489" />
                <span>123 Pet Avenue, NY 10001</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9CA3AF' }}>
                <Phone size={18} color="#0d9489" />
                <span>+91 1800 PET SAFE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9CA3AF' }}>
                <Mail size={18} color="#0d9489" />
                <span>help@petsafety.com</span>
              </div>
            </Space>
          </Col>
        </Row>

        <div style={{ borderTop: '1px solid #374151', margin: '40px 0 24px' }}></div>
        
        <div style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
          © {new Date().getFullYear()} PetSafety. All rights reserved. 🐾 Keep your pets safe!
        </div>
      </div>
    </footer>
  );
}
