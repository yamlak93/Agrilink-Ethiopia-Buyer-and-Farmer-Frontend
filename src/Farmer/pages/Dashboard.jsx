import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import SummaryCard from "../components/SummaryCard";
import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import EditProductModal from "../components/EditProductModal";
import ConfirmationModal from "../components/ConfirmationModal";
import StylishModal from "../components/StylishModal";
import apiClient from "../../api/api"; // Import the api.js client
import { useTranslation } from "react-i18next";

import Loader from "../../assets/Agriculture Loader.mp4";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingDeliveries, setPendingDeliveries] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: "0.00",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        console.log("Retrieved token:", token);
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login", { replace: true });
          return;
        }

        // Safely decode JWT token (optional, for additional validation)
        let decodedToken;
        try {
          decodedToken = JSON.parse(atob(token.split(".")[1]));
          console.log("Decoded token payload:", decodedToken);
        } catch (decodeError) {
          console.error("Failed to decode token:", decodeError);
          navigate("/login", {
            replace: true,
            state: { message: "Invalid token format." },
          });
          return;
        }

        const farmerId = decodedToken.farmerId || decodedToken.id;
        if (!farmerId) {
          console.error("farmerId not found in token:", decodedToken);
          navigate("/login", {
            replace: true,
            state: { message: "farmerId not found in token." },
          });
          return;
        }

        // Fetch data using apiClient
        const [
          productsResponse,
          ordersResponse,
          deliveriesResponse,
          analyticsResponse,
        ] = await Promise.all([
          apiClient.get("/products"),
          apiClient.get(`/orders/total?farmerId=${farmerId}`),
          apiClient.get(`/deliveries/pending?farmerId=${farmerId}`),
          apiClient.get("/analytics"),
        ]);

        setTotalProducts(productsResponse.data.length);
        const sortedProducts = productsResponse.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setProducts(sortedProducts);

        setTotalOrders(ordersResponse.data.totalOrders);
        setPendingDeliveries(deliveriesResponse.data.pendingDeliveries);

        const { salesAnalytics } = analyticsResponse.data;
        setAnalyticsData({
          totalRevenue: `${Number(salesAnalytics.totalRevenue || 0).toFixed(
            2
          )} ETB`,
        });

        console.log(
          "Fetched data at",
          new Date().toLocaleString("en-US", {
            timeZone: "Africa/Addis_Ababa",
          }),
          {
            products: sortedProducts,
            totalOrders: ordersResponse.data.totalOrders,
            pendingDeliveries: deliveriesResponse.data.pendingDeliveries,
            analytics: analyticsResponse.data,
            farmerId,
          }
        );
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        let errorMessage = "Failed to fetch data. Please try again.";
        let errorDetails = err.message || "Unknown error";

        if (err.code === "ECONNABORTED") {
          errorMessage = "Network Error: Request timed out.";
          errorDetails = "Please check your internet connection.";
        } else if (err.response) {
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login", {
              replace: true,
              state: {
                message:
                  "Session expired or invalid token. Please log in again.",
              },
            });
            return;
          }
          errorMessage =
            err.response.data?.message ||
            `Server Error: ${err.response.status} ${err.response.statusText}`;
          errorDetails = err.response.data?.error || err.response.data;
        }

        navigate("/error", {
          state: { error: { message: errorMessage, details: errorDetails } },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleOpenDetailModal = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedProduct(null);
  };

  const handleOpenEditModal = () => {
    setDetailModalVisible(false);
    setEditModalVisible(true);
  };
  const handleCloseEditModal = () => setEditModalVisible(false);

  const handleSaveEdit = (updatedProduct) => {
    setProducts(
      products.map((p) =>
        p.productId === updatedProduct.productId
          ? { ...p, ...updatedProduct }
          : p
      )
    );
    setEditModalVisible(false);
    setSuccessModalVisible(true);
  };

  const handleOpenConfirmationModal = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(false);
    setConfirmationModalVisible(true);
  };
  const handleCloseConfirmationModal = () => setConfirmationModalVisible(false);

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      await apiClient.delete(`/products/${selectedProduct.productId}`);
      setProducts(
        products.filter((p) => p.productId !== selectedProduct.productId)
      );
      setConfirmationModalVisible(false);
      setSuccessModalVisible(true);
      setTotalProducts((prevCount) => prevCount - 1);
    } catch (err) {
      let errorMessage = "Failed to delete product. Please try again.";
      let errorDetails = err.message || "Unknown error";

      if (err.code === "ECONNABORTED") {
        errorMessage = "Network Error: Request timed out.";
        errorDetails = "Please check your internet connection.";
      } else if (err.response) {
        if (err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", {
            replace: true,
            state: { message: "Session expired. Please log in again." },
          });
          return;
        }
        errorMessage =
          err.response.data?.message ||
          `Server Error: ${err.response.status} ${err.response.statusText}`;
        errorDetails = err.response.data?.error || err.response.data;
      }

      navigate("/error", {
        state: { error: { message: errorMessage, details: errorDetails } },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3>
                {t("roles.farmer")} {t("navigation.dashboard")}
              </h3>
            </div>
            <div>
              <Link to={"/farmer/add-product"}>
                <button className="btn btn-success">
                  {t("products.addProduct")}
                </button>
              </Link>
            </div>
          </div>
          <div className="row my-4">
            <SummaryCard
              title={t("dashboard.products")}
              value={totalProducts}
              icon="📦"
            />
            <SummaryCard
              title={t("dashboard.orders")}
              value={totalOrders}
              icon="🛒"
            />
            <SummaryCard
              title={t("dashboard.deliveries")}
              value={pendingDeliveries}
              icon="📅"
            />
            <SummaryCard
              title={t("dashboard.revenue")}
              value={analyticsData.totalRevenue}
              icon="📈"
            />
          </div>

          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              {t("dashboard.recentProducts")}
            </h3>
            {loading && (
              <div
                className="text-center"
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  style={{
                    width: "300px",
                    height: "300px",
                    display: "block",
                    margin: "0 auto",
                  }}
                >
                  <source src={Loader} type="video/webm" />
                  {t("common.loading")}
                </video>
              </div>
            )}
            {!loading && products.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.productId}
                    title={product.title}
                    price={product.price}
                    unit={product.unit}
                    location={product.location}
                    available={product.available}
                    imageUrl={product.imageUrl}
                    onViewDetails={() => handleOpenDetailModal(product)}
                  />
                ))}
              </div>
            ) : !loading && products.length === 0 ? (
              <p className="text-center text-gray-500">
                {t("dashboard.noProducts")}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <ProductDetailModal
        isVisible={isDetailModalVisible}
        product={selectedProduct}
        onClose={handleCloseDetailModal}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenConfirmationModal}
      />
      <EditProductModal
        isVisible={isEditModalVisible}
        product={selectedProduct}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
      />
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        message={t("confirmations.deleteConfirm")}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmDelete}
      />
      <StylishModal
        isVisible={isSuccessModalVisible}
        message={t("products.updateSuccess")}
        type="success"
        onClose={handleCloseSuccessModal}
      />
    </>
  );
};

export default Dashboard;
