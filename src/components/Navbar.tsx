import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Badge, Input, Layout, Drawer, Space, Dropdown } from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { PawPrint } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const { Header } = Layout;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/store?search=${encodeURIComponent(value.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Store", href: "/store" },
    { label: "Adopt", href: "/adoption" },
    { label: "Register Pet", href: "/register-pet" },
  ];

  return (
    <>
      <style>{`
        .desktop-only { display: flex; }
        .desktop-block { display: block; }
        .mobile-only { display: none !important; }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .desktop-block { display: none !important; }
          .mobile-only { display: block !important; }
        }

        .nav-link {
          color: #4B5563;
          font-weight: 500;
          font-size: 15px;
          text-decoration: none;
          transition: color 0.3s;
        }
        .nav-link:hover {
          color: #0d9489;
        }
      `}</style>

      {/* Top Banner */}
      <div style={{ background: '#0d9489', color: '#fff', textAlign: 'center', padding: '8px 16px', fontSize: '13px' }}>
        <span>🐾 Free shipping on orders above ₹999. Protect your pet today!</span>
      </div>

      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderBottom: '1px solid #f3f4f6',
        height: '72px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
           <div style={{ background: '#0d9489', borderRadius: '8px', padding: '6px', display: 'flex' }}>
             <PawPrint size={24} color="#fff" />
           </div>
           <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
             Pet<span style={{ color: '#0d9489' }}>Safety</span>
           </span>
        </Link>

        {/* Desktop Search */}
        <div style={{ flex: 1, maxWidth: '400px', margin: '0 24px' }} className="desktop-block">
          <Input.Search
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            placeholder="Search for QR belts, collars..."
            enterButton={<SearchOutlined />}
            size="large"
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: '24px' }}>
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '24px' }}>
          <Link to="/cart">
            <Badge count={totalItems} size="small" offset={[-2, 2]}>
              <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: '22px', color: '#4B5563' }} />} />
            </Badge>
          </Link>

          <div className="desktop-only" style={{ alignItems: 'center', gap: '8px' }}>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <Dropdown
                    menu={{
                      items: [
                        { key: 'dashboard', label: <span onClick={() => navigate('/dashboard')}>Dashboard</span> },
                        { key: 'admin', label: <span onClick={() => navigate('/admin')}>Manage Product & Order</span> },
                      ],
                    }}
                    trigger={['click']}
                  >
                    <Button type="text" style={{ fontWeight: 500, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UserOutlined /> {user.name}
                    </Button>
                  </Dropdown>
                ) : (
                  <Button type="text" onClick={() => navigate('/dashboard')} style={{ fontWeight: 500, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserOutlined /> {user?.name || 'User'}
                  </Button>
                )}
                <Button type="text" onClick={logout} title="Logout" icon={<LogoutOutlined />} />
              </>
            ) : (
              <Button type="primary" icon={<UserOutlined />} onClick={() => navigate('/login')} style={{ background: '#0d9489' }}>
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button 
            type="text" 
            icon={<MenuOutlined style={{ fontSize: '20px' }} />} 
            onClick={() => setMobileOpen(true)} 
            className="mobile-only"
          />
        </div>
      </Header>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        width={280}
      >
        <Input.Search
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            placeholder="Search..."
            enterButton
            style={{ marginBottom: '24px' }}
        />
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} style={{ fontSize: '16px', color: '#111827', display: 'block' }}>
              {link.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #f3f4f6', margin: '8px 0' }}></div>
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <div 
                  onClick={() => { 
                    navigate('/admin');
                    setMobileOpen(false); 
                  }} 
                  style={{ fontSize: '16px', color: '#111827', display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', marginBottom: '16px' }}
                >
                  <DashboardOutlined /> Manage Product & Order
                </div>
              )}
              <div 
                onClick={() => { 
                  navigate('/dashboard');
                  setMobileOpen(false); 
                }} 
                style={{ fontSize: '16px', color: '#111827', display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', marginBottom: '16px' }}
              >
                <UserOutlined /> Dashboard ({user?.name || 'User'})
              </div>
              <div onClick={() => { logout(); setMobileOpen(false); }} style={{ fontSize: '16px', color: '#EF4444', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <LogoutOutlined /> Logout
              </div>
            </>
          ) : (
            <Button type="primary" size="large" block onClick={() => { navigate('/login'); setMobileOpen(false); }} style={{ background: '#0d9489' }}>
              Login
            </Button>
          )}
        </Space>
      </Drawer>
    </>
  );
}
