// src/Farmer/pages/Orders.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import OrderCard from "../components/OrderCard";
import OrderDetailModal from "../components/OrderDetailModal";
import CancelReasonModal from "../components/CancelReasonModal"; // NEW
import StylishModal from "../components/StylishModal";
import { useTranslation } from "react-i18next";
import apiClient from "../../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../assets/Agriculture Loader.mp4";

const Orders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ startDate: "" });
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isCancelReasonModalVisible, setCancelReasonModalVisible] =
    useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderIdForCancel, setSelectedOrderIdForCancel] =
    useState(null);
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

      const response = await apiClient.get("/orders");
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
            status: (order.status || "unknown").toLowerCase(),
            date: order.date || "",
            deliveryDate: order.deliveryDate || "",
            updatedAt: order.updatedAt || "",
            products: order.products || [],
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(transformedOrders);
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
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = (order) => {
    setSelectedOrderIdForCancel(order.orderId); // ← Use orderId, not whole object
    setCancelReasonModalVisible(true);
  };

  const handleConfirmCancel = async (orderId, reason) => {
    try {
      const response = await apiClient.put(`/orders/${orderId}/cancel`, {
        reason,
      });

      setOrders(
        orders.map((o) =>
          o.orderId === orderId
            ? { ...o, status: "cancelled", cancelReason: reason }
            : o
        )
      );

      setCancelReasonModalVisible(false);
      setSuccessMessage(`Order ${orderId} cancelled. Full refund initiated.`);
      setSuccessModalVisible(true);

      // Optional: refresh
      // fetchOrders();
    } catch (error) {
      console.error("Error cancelling:", error);
      const msg = error.response?.data?.message || "Failed to cancel order.";
      setSuccessMessage(msg);
      setSuccessModalVisible(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
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
          <header className="mb-4">
            <h2>{t("orders.title")}</h2>
            <p className="text-muted">{t("orders.subtitle")}</p>
          </header>

          <div className="bg-white p-4 rounded shadow-sm">
            <ul className="nav nav-pills mb-4">
              {[
                "all",
                "pending",
                "processing",
                "in transit",
                "delivered",
                "cancelled",
              ].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${
                      activeTab === tab ? "bg-success text-white" : ""
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {t(`orders.${tab}`)}
                  </button>
                </li>
              ))}
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
                onChange={(e) => setDateFilter({ startDate: e.target.value })}
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
                      onCancelOrder={handleCancelOrder}
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
        onCancelOrder={handleCancelOrder}
        onRefresh={fetchOrders}
      />

      <CancelReasonModal
        show={isCancelReasonModalVisible}
        onClose={() => setCancelReasonModalVisible(false)}
        onConfirm={handleConfirmCancel}
        orderId={selectedOrderIdForCancel}
      />

      <StylishModal
        isVisible={isSuccessModalVisible}
        message={successMessage}
        type="success"
        onClose={handleCloseSuccessModal}
      />
    </>
  );
};

export default Orders;
