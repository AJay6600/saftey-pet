import React, { useContext } from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { Layout, App as AntApp, ConfigProvider } from "antd";
import Navbar from "./components/Navbar";
import AppFooter from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Store from "./pages/Store";
import Adoption from "./pages/Adoption";
import QRScannerResult from "./pages/QRScannerResult";
import RegisterPet from "./pages/RegisterPet";
import AdoptionDetails from "./pages/AdoptionDetails";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import PostAdoption from "./pages/PostAdoption";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { themeConfig } from "./utils/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./context/CartContext";

const { Content } = Layout;

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={themeConfig}>
        <AntApp>
          <BrowserRouter>
            <AuthProvider>
              <Layout
                style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}
              >
                <CartProvider>
                  <Navbar />
                  <Content>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      <Route path="/store" element={<Store />} />
                      <Route
                        path="/store/product/:id"
                        element={<ProductDetails />}
                      />
                      <Route path="/cart" element={<Cart />} />
                      <Route
                        path="/checkout"
                        element={
                          <PrivateRoute>
                            <Checkout />
                          </PrivateRoute>
                        }
                      />

                      <Route path="/adoption" element={<Adoption />} />
                      <Route
                        path="/adoption/:id"
                        element={<AdoptionDetails />}
                      />
                      <Route
                        path="/adoption/post"
                        element={
                          <PrivateRoute>
                            <PostAdoption />
                          </PrivateRoute>
                        }
                      />

                      <Route path="/qr/:id" element={<QRScannerResult />} />

                      <Route
                        path="/dashboard"
                        element={
                          <PrivateRoute>
                            <Dashboard />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <PrivateRoute>
                            <AdminDashboard />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/register-pet"
                        element={
                          <PrivateRoute>
                            <RegisterPet />
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </Content>
                  <AppFooter />
                </CartProvider>
              </Layout>
            </AuthProvider>
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
