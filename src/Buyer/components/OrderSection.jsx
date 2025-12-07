// src/components/OrderSection.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaShoppingBag,
  FaClock,
  FaSpinner,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const OrdersSection = ({ orders = [] }) => {
  const { t } = useTranslation();

  // === FORMAT DATE & TIME IN EAT ===
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-ET", {
      timeZone: "Africa/Addis_Ababa",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // === TRANSLATE UNIT ===
  const translateUnit = (unit) => {
    const key = unit?.toLowerCase().trim();
    const translated = t(`units.${key}`, { defaultValue: unit });
    return translated;
  };

  // === GET ICON BY STATUS ===
  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "pending":
        return <FaClock className="me-1" />;
      case "processing":
        return <FaSpinner className="me-1" />;
      case "in transit":
      case "in_transit":
        return <FaTruck className="me-1" />;
      case "delivered":
        return <FaCheckCircle className="me-1" />;
      case "cancelled":
        return <FaTimesCircle className="me-1" />;
      default:
        return <FaClock className="me-1" />;
    }
  };

  // === GET BADGE COLOR BY STATUS ===
  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "pending":
      case "processing":
        return "bg-warning text-dark";
      case "in transit":
      case "in_transit":
        return "bg-primary text-white";
      case "delivered":
        return "bg-success text-white";
      case "cancelled":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  return (
    <div className="card shadow-sm p-4 h-100 border-0 rounded-3">
      <h5 className="fw-bold mb-2">{t("buyerDashboard.recentOrders")}</h5>
      <p className="text-muted mb-4">{t("buyerDashboard.orderDetails")}</p>

      <div
        className="list-group"
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {orders.length === 0 ? (
          <p className="text-center text-muted">
            {t("buyerDashboard.noOrders")}
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.orderId}
              className="list-group-item list-group-item-action border-0 shadow-sm mb-3 rounded-3 p-3"
            >
              <div className="d-flex align-items-start">
                <FaShoppingBag className="text-success me-3 fs-4 flex-shrink-0" />
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-semibold">{order.productName}</h6>
                  <small className="text-muted">
                    {t("buyerDashboard.orderedOn")}{" "}
                    {formatDateTime(order.orderDate)}
                  </small>
                  <div className="mt-2 text-muted small">
                    <strong>{t("common.quantity")}:</strong> {order.quantity}{" "}
                    {translateUnit(order.unit)} |
                    <strong> {t("common.price")}:</strong> {order.price} ETB/
                    {translateUnit(order.unit)} |
                    <strong> {t("common.total")}:</strong> {order.total} ETB
                  </div>
                </div>
              </div>
              <div className="mt-2 text-end">
                <span
                  className={`badge px-3 py-2 rounded-pill ${getStatusClass(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  {t(`orders.${order.status.toLowerCase().replace(" ", "_")}`)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <Link
        to="/buyer/orders"
        className="mt-4 btn btn-outline-success w-100 fw-semibold shadow-sm"
      >
        {t("buyerDashboard.viewAllOrders")}
      </Link>

      <style>
        {`
          .list-group::-webkit-scrollbar {
            width: 0;
            background: transparent;
          }
        `}
      </style>
    </div>
  );
};

export default OrdersSection;
