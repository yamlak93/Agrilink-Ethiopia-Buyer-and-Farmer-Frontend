// src/Buyer/pages/OrdersPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/Devices.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import OrderCard from "../components/OrderCard";
import OrderDetailModal from "../components/OrderDetailModal";
import CancelReasonModal from "../components/CancelReasonModal";
import StylishModal from "../components/StylishModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../api/api";
import { useTranslation } from "react-i18next";

// === STATUS BADGE (unchanged) ===
export const getStatusBadge = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "delivered":
      return "bg-success text-white";
    case "in transit":
      return "bg-primary text-white";
    case "processing":
      return "bg-info text-white";
    case "pending":
      return "bg-warning text-dark";
    case "cancelled":
      return "bg-danger text-white";
    default:
      return "bg-secondary text-white";
  }
};

const OrdersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // internal key
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ startDate: "" });
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isCancelReasonModalVisible, setCancelReasonModalVisible] =
    useState(false);
  const [selectedOrderIdForCancel, setSelectedOrderIdForCancel] =
    useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const response = await apiClient.get("/buyer/orders");
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  // === FILTER LOGIC (Farmer-style) ===
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const normalizedStatus = order.status?.toLowerCase().replace(/\s+/g, "_");

      const matchesTab =
        activeTab === "all" ||
        normalizedStatus === activeTab ||
        (activeTab === "in_transit" && normalizedStatus === "in_transit");

      const matchesSearch =
        String(order.orderId ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(order.farmerName ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.products.some((p) =>
          String(p.productName ?? "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

      const matchesDate =
        !dateFilter.startDate || order.orderDate === dateFilter.startDate;

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

  const handleCancelOrder = (orderId) => {
    setSelectedOrderIdForCancel(orderId);
    setCancelReasonModalVisible(true);
  };

  const handleConfirmCancel = async (orderId, reason) => {
    try {
      await apiClient.put(`/buyer/orders/${orderId}/cancel`, { reason });

      setOrders(
        orders.map((o) =>
          o.id === orderId
            ? { ...o, status: "cancelled", cancelReason: reason }
            : o
        )
      );

      setCancelReasonModalVisible(false);
      setSuccessMessage(t("buyerOrders.cancelSuccess", { orderId }));
      setSuccessModalVisible(true);
    } catch (error) {
      console.error("Error cancelling:", error);
      const msg =
        error.response?.data?.message || t("buyerOrders.cancelFailed");
      setSuccessMessage(msg);
      setSuccessModalVisible(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
    setSuccessMessage("");
  };

  // === STATUS TABS (Farmer-style) ===
  const tabs = [
    "all",
    "pending",
    "processing",
    "in_transit",
    "delivered",
    "cancelled",
  ];

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <h2
            className="fw-bold"
            style={{ fontSize: "24px", color: "#1a2e5a" }}
          >
            {t("buyerOrders.title")}
          </h2>
          <p
            className="text-muted"
            style={{ fontSize: "14px", color: "#6c757d" }}
          >
            {t("buyerOrders.subtitle")}
          </p>

          <div className="bg-white p-4 rounded shadow-sm">
            <h5 className="mb-3">{t("buyerOrders.historyTitle")}</h5>

            {/* === STATUS TABS === */}
            <ul className="nav nav-pills mb-4 flex-wrap">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${
                      activeTab === tab ? "bg-success text-white" : ""
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {t(`buyerOrders.tabs.${tab}`)}
                  </button>
                </li>
              ))}
            </ul>

            {/* === SEARCH + DATE FILTER === */}
            <div className="mb-4 d-flex gap-2 align-items-center">
              <div
                className="position-relative flex-grow-1"
                style={{ maxWidth: "300px" }}
              >
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder={t("buyerOrders.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                  style={{ fontSize: "14px" }}
                />
              </div>
              <input
                type="date"
                className="form-control"
                style={{ width: "160px" }}
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter({ startDate: e.target.value })}
              />
            </div>

            {/* === ORDER LIST === */}
            <div className="order-list">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">
                      {t("buyerOrders.loading")}
                    </span>
                  </div>
                  <p className="text-muted mt-2">
                    {t("buyerOrders.loadingText")}
                  </p>
                </div>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleOpenDetailModal}
                    getStatusBadge={getStatusBadge}
                  />
                ))
              ) : (
                <p className="text-center text-muted py-5">
                  {t("buyerOrders.noOrders")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === MODALS === */}
      <OrderDetailModal
        isVisible={isDetailModalVisible}
        order={selectedOrder}
        onClose={handleCloseDetailModal}
        onCancelOrder={handleCancelOrder}
        getStatusBadge={getStatusBadge}
      />

      <StylishModal
        isVisible={isSuccessModalVisible}
        message={successMessage}
        type="success"
        onClose={handleCloseSuccessModal}
      />

      <CancelReasonModal
        show={isCancelReasonModalVisible}
        onClose={() => setCancelReasonModalVisible(false)}
        onConfirm={handleConfirmCancel}
        orderId={selectedOrderIdForCancel}
      />
    </>
  );
};

export default OrdersPage;
