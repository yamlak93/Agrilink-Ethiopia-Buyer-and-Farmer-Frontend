import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import OrderCard from "../components/OrderCard";
import OrderDetailModal from "../components/OrderDetailModal";
import ConfirmationModal from "../components/ConfirmationModal";
import StylishModal from "../components/StylishModal";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../assets/Agriculture Loader.mp4";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }
    return this.props.children;
  }
}

const Orders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ startDate: "" });
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transformedOrders = response.data
        .map((order) => {
          const firstProduct = order.products?.[0] || {};
          return {
            orderId: order.orderId || "",
            product: firstProduct.productName || t("products.noProducts"),
            buyerName: order.buyerName || t("orders.buyer"),
            buyerPhone:
              order.buyerPhone != null ? String(order.buyerPhone) : "",
            quantity: firstProduct.quantity || 0,
            total: order.total || 0,
            status: (order.status || "unknown").toLowerCase(), // Ensure status is always set
            date: order.date || "",
            deliveryDate: order.deliveryDate || "",
            updatedAt: order.updatedAt || "", // Include updatedAt
            products: order.products || [], // Ensure products array
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(transformedOrders);
      console.log("Transformed orders:", transformedOrders); // Debug log
    } catch (err) {
      console.error(
        "Failed to fetch orders:",
        err.response?.data || err.message
      );
      setError(t("errors.networkError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const normalizedStatus = order.status.toLowerCase();
      const matchesTab =
        activeTab === "all" ||
        normalizedStatus === activeTab ||
        (activeTab === "pending" && normalizedStatus === "pending") ||
        (activeTab === "processing" && normalizedStatus === "processing") ||
        (activeTab === "in transit" && normalizedStatus === "in transit");

      const matchesSearch =
        String(order.product ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(order.buyerName ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(order.orderId ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(order.buyerPhone ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesDate =
        !dateFilter.startDate || order.date === dateFilter.startDate;

      return matchesTab && matchesSearch && matchesDate;
    });
  }, [orders, activeTab, searchTerm, dateFilter]);

  const handleOpenDetailModal = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
    console.log("Selected order for modal:", order); // Debug log
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedOrder(null);
  };

  const handleOpenConfirmationModal = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(false);
    setConfirmationModalVisible(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModalVisible(false);
  };

  const handleConfirmCancel = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      if (!selectedOrder || !selectedOrder.orderId) {
        setSuccessMessage(t("orders.orderFailed"));
        setSuccessModalVisible(true);
        return;
      }

      await axios.patch(
        `http://localhost:5000/api/orders/${selectedOrder.orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConfirmationModalVisible(false);
      setSuccessMessage(t("orders.orderSuccess"));
      setSuccessModalVisible(true);
      fetchOrders(); // Re-fetch after cancel
    } catch (err) {
      console.error("Failed to cancel order:", err.message);
      setSuccessMessage(t("orders.orderFailed"));
      setSuccessModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <ErrorBoundary>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <header className="mb-4">
            <h2>{t("orders.title")}</h2>
            <p className="text-muted">{t("orders.subtitle")}</p>
          </header>

          <div className="bg-white p-4 rounded shadow-sm">
            <ul className="nav nav-pills mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "all" ? "bg-success text-white" : ""
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  {t("common.all")}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "pending" ? "bg-success text-white" : ""
                  }`}
                  onClick={() => setActiveTab("pending")}
                >
                  {t("orders.pending")}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "processing" ? "bg-success text-white" : ""
                  }`}
                  onClick={() => setActiveTab("processing")}
                >
                  {t("orders.processing")}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "in transit" ? "bg-success text-white" : ""
                  }`}
                  onClick={() => setActiveTab("in transit")}
                >
                  {t("delivery.inTransit")}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "delivered" ? "bg-success text-white" : ""
                  }`}
                  onClick={() => setActiveTab("delivered")}
                >
                  {t("orders.delivered")}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "cancelled" ? "bg-success text-white" : ""
                  }`}
                  onClick={() => setActiveTab("cancelled")}
                >
                  {t("orders.cancelled")}
                </button>
              </li>
            </ul>

            <div className="mb-4 d-flex align-items-center">
              <input
                type="text"
                className="form-control me-3"
                style={{ width: "250px" }}
                placeholder={t("common.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="date"
                className="form-control"
                style={{ width: "150px" }}
                value={dateFilter.startDate}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, startDate: e.target.value })
                }
              />
            </div>

            {loading && (
              <div className="text-center p-3">
                <video
                  autoPlay
                  loop
                  muted
                  style={{ width: "300px", height: "300px" }}
                >
                  <source src={Loader} type="video/webm" />
                </video>
              </div>
            )}

            {error && <p className="text-center text-danger">{error}</p>}

            {!loading && !error && (
              <div className="order-list">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderCard
                      key={order.orderId}
                      order={order}
                      onViewDetails={handleOpenDetailModal}
                      onCancelOrder={handleOpenConfirmationModal}
                    />
                  ))
                ) : (
                  <p className="text-muted text-center mt-5">
                    {t("products.noProducts")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <OrderDetailModal
        isVisible={isDetailModalVisible}
        order={selectedOrder}
        onClose={handleCloseDetailModal}
        onCancelOrder={handleOpenConfirmationModal}
        onRefresh={fetchOrders}
      />
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        message={t("confirmations.areYouSure")}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmCancel}
      />
      <StylishModal
        isVisible={isSuccessModalVisible}
        message={successMessage}
        type="success"
        onClose={handleCloseSuccessModal}
      />
    </ErrorBoundary>
  );
};

export default Orders;
