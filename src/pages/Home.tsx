import { useState, useEffect } from "react";
import { Typography, Button, Row, Col, Space, Card, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  QrCode,
  Truck,
  Headphones,
  ArrowRight,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import heroImage from "../assets/hero.png";
import api from "../api/axios";

const { Title, Paragraph, Text } = Typography;

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  tag?: string;
}

interface AdoptionPost {
  _id: string;
  petName: string;
  animalType: string;
  breed: string;
  age: string;
  location: string;
  photo: string;
  description: string;
  isAdopted: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [adoptions, setAdoptions] = useState<AdoptionPost[]>([]);
  const [loadingAdoptions, setLoadingAdoptions] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, adoptionsRes] = await Promise.all([
          api.get("/shop/products"),
          api.get("/adoptions"),
        ]);
        setProducts(productsRes.data.slice(0, 4));
        setAdoptions(
          adoptionsRes.data
            .filter((a: AdoptionPost) => !a.isAdopted)
            .slice(0, 3),
        );
      } catch (error) {
        console.error(error);
      }
      setLoadingProducts(false);
      setLoadingAdoptions(false);
    };
    fetchHomeData();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      {/* Hero Section Container */}
      <div
        style={{
          background: "linear-gradient(135deg, #117871 0%, #0c4355 100%)",
          padding: "80px 24px 120px 24px",
          color: "white",
        }}
      >
        <div
          className="page-container"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <Row gutter={[48, 48]} align="middle">
            {/* Left Column Content */}
            <Col xs={24} lg={12}>
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    padding: "6px 16px",
                    borderRadius: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <ShieldCheck
                    size={16}
                    color="white"
                    style={{ marginRight: "8px" }}
                  />
                  <Text style={{ color: "white", fontWeight: 500 }}>
                    Trusted by 10,000+ pet owners
                  </Text>
                </div>
              </div>

              <Title
                style={{
                  fontSize: "56px",
                  fontWeight: 800,
                  color: "white",
                  marginBottom: "8px",
                  lineHeight: 1.1,
                }}
              >
                Keep Your Pet <br />
                <span style={{ color: "#f97316" }}>Safe & Found</span>
              </Title>

              <Paragraph
                style={{
                  fontSize: "18px",
                  color: "#e2e8f0",
                  maxWidth: "500px",
                  margin: "24px 0 40px 0",
                  lineHeight: 1.6,
                }}
              >
                Generate QR codes for your pets. Attach them to smart belts.
                Anyone who finds your pet can instantly see your contact
                details.
              </Paragraph>

              <Space size="middle" wrap>
                <Button
                  type="primary"
                  size="large"
                  icon={<QrCode size={18} />}
                  onClick={() => navigate("/register-pet")}
                  style={{
                    backgroundColor: "#f97316",
                    borderColor: "#f97316",
                    height: "48px",
                    padding: "0 32px",
                    fontSize: "16px",
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                >
                  Register Your Pet
                </Button>
                <Button
                  size="large"
                  onClick={() => navigate("/store")}
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "white",
                    height: "48px",
                    padding: "0 32px",
                    fontSize: "16px",
                    fontWeight: 600,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Shop QR Belts <ArrowRight size={18} />
                </Button>
              </Space>
            </Col>

            {/* Right Column Image */}
            <Col xs={24} lg={12}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <img
                  src={heroImage}
                  alt="Happy Golden Retriever with a smart QR collar"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    borderRadius: "24px",
                    // boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    objectFit: "cover",
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Feature Section overlapping the hero */}
      <div
        className="page-container"
        style={{
          maxWidth: "1200px",
          margin: "-60px auto 0 auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "32px",
          }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <QrCode color="#10b981" size={24} />
                </div>
                <div>
                  <Title
                    level={5}
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#1f2937",
                    }}
                  >
                    Instant QR Codes
                  </Title>
                  <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                    Direct pet info
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <ShieldCheck color="#10b981" size={24} />
                </div>
                <div>
                  <Title
                    level={5}
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#1f2937",
                    }}
                  >
                    Pet Safety
                  </Title>
                  <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                    24/7 protection
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <Truck color="#10b981" size={24} />
                </div>
                <div>
                  <Title
                    level={5}
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#1f2937",
                    }}
                  >
                    Free Delivery
                  </Title>
                  <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                    Orders above ₹999
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <Headphones color="#10b981" size={24} />
                </div>
                <div>
                  <Title
                    level={5}
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#1f2937",
                    }}
                  >
                    24/7 Support
                  </Title>
                  <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                    We're here to help
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* QR Smart Belts Products Section */}
      <div
        className="page-container"
        style={{
          maxWidth: "1200px",
          margin: "80px auto 40px auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "32px",
          }}
        >
          <div>
            <Title
              level={2}
              style={{ margin: "0 0 8px 0", color: "#111827", fontWeight: 800 }}
            >
              QR Smart Belts
            </Title>
            <Text style={{ color: "#6b7280", fontSize: "16px" }}>
              Protect your pet with our best-selling belts
            </Text>
          </div>
          <Button
            type="default"
            onClick={() => navigate("/store")}
            style={{
              borderColor: "#6b7280",
              color: "#0d9489",
              border: "none",
              background: "transparent",
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 500,
              padding: 0,
            }}
          >
            View All <ArrowRight size={16} />
          </Button>
        </div>

        {loadingProducts ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {products.map((product) => {
              let tagText = product.tag || "";
              let tagColor = "#f97316"; // default orange
              if (tagText === "Premium") tagColor = "#8b5cf6";
              else if (tagText === "New Arrival") tagColor = "#10b981";
              else if (tagText === "Best Seller") tagColor = "#ef4444";
              else if (tagText === "Popular") tagColor = "#f97316";

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: "relative" }}>
                        {tagText && (
                          <div
                            style={{
                              position: "absolute",
                              top: "12px",
                              left: "12px",
                              zIndex: 1,
                              backgroundColor: tagColor,
                              color: "white",
                              padding: "4px 12px",
                              borderRadius: "16px",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {tagText}
                          </div>
                        )}
                        <img
                          alt={product.name}
                          src={product.image}
                          style={{
                            height: "260px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    }
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.04)",
                    }}
                    onClick={() => navigate(`/store/product/${product._id}`)}
                    bodyStyle={{ padding: "20px" }}
                    actions={[
                      <Button
                        type="primary"
                        icon={<ShoppingCart size={16} />}
                        block
                        style={{
                          margin: "0 8px",
                          width: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                          message.success("Added to cart");
                        }}
                      >
                        Add to Cart
                      </Button>,
                    ]}
                  >
                    <Title
                      level={5}
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "16px",
                        color: "#1f2937",
                      }}
                    >
                      {product.name}
                    </Title>
                    <div
                      style={{
                        color: "#111827",
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      ₹{product.price}{" "}
                      <Text
                        delete
                        style={{
                          color: "#9ca3af",
                          fontSize: "14px",
                          fontWeight: "normal",
                          marginLeft: "4px",
                        }}
                      >
                        ₹{product.price + 300}
                      </Text>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>

      {/* Adopt a Pet Section */}
      <div
        className="page-container"
        style={{
          maxWidth: "1200px",
          margin: "80px auto 40px auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "32px",
          }}
        >
          <div>
            <Title
              level={2}
              style={{
                display: "flex",
                alignItems: "center",
                margin: "0 0 8px 0",
                color: "#111827",
                fontWeight: 800,
              }}
            >
              <Heart
                size={32}
                color="#f97316"
                style={{ marginRight: "12px" }}
              />
              Adopt a Pet
            </Title>
            <Text style={{ color: "#6b7280", fontSize: "16px" }}>
              Give a loving home to a pet in need
            </Text>
          </div>
          <Button
            type="default"
            onClick={() => navigate("/adoption")}
            style={{
              borderColor: "#6b7280",
              color: "#0d9489",
              border: "none",
              background: "transparent",
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 500,
              padding: 0,
            }}
          >
            View All <ArrowRight size={16} />
          </Button>
        </div>

        {loadingAdoptions ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {adoptions.map((post) => (
              <Col xs={24} md={8} key={post._id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ position: "relative" }}>
                      <img
                        alt={post.petName}
                        src={post.photo}
                        style={{
                          height: "300px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "12px",
                          left: "12px",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: "4px 12px",
                            borderRadius: "16px",
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#1f2937",
                          }}
                        >
                          {post.animalType}
                        </div>
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: "4px 12px",
                            borderRadius: "16px",
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#1f2937",
                          }}
                        >
                          {post.breed}
                        </div>
                      </div>
                    </div>
                  }
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.04)",
                  }}
                  onClick={() => navigate(`/adoption/${post._id}`)}
                  bodyStyle={{ padding: "24px" }}
                >
                  <Title
                    level={4}
                    style={{ margin: "0 0 8px 0", color: "#111827" }}
                  >
                    {post.petName}
                  </Title>
                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    {post.age} • {post.location}
                  </div>
                  <Paragraph
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Home;
