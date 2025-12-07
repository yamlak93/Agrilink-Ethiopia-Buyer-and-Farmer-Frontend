// src/Buyer/components/OrderDetailModal.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCalendarAlt,
  faTruck,
  faBoxOpen,
  faMoneyBillWave,
  faUser,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";

// === STATUS BADGE (unchanged) ===
const getStatusBadge = (status) => {
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

const OrderDetailModal = ({
  isVisible,
  order,
  onClose,
  onCancelOrder,
  getStatusBadge: passedBadge,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const root = document.getElementById("modal-root");
    if (!root) {
      const div = document.createElement("div");
      div.id = "modal-root";
      document.body.appendChild(div);
    }
  }, []);

  if (!isVisible || !order) return null;

  const badgeFn = passedBadge || getStatusBadge;

  const canCancel = ["pending", "processing"].includes(
    order.status?.toLowerCase()
  );

  // === TRANSLATE UNIT ===
  const translateUnit = (unit) =>
    t(`units.${unit?.toLowerCase().trim()}`, { defaultValue: unit });

  // === TRANSLATE STATUS ===
  const translateStatus = (status) => {
    const key = status?.toLowerCase().replace(/\s+/g, "_");
    return t(`buyerOrders.tabs.${key}`, { defaultValue: status });
  };

  // === FORMAT DELIVERY DATE ===
  const formatDeliveryDate = (date) =>
    date || t("buyerOrders.modal.estimatedDelivery");

  const modalContent = (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg rounded-3">
          {/* Header */}
          <div
            className="modal-header text-white"
            style={{
              background: "linear-gradient(90deg, #2e7d32, #43a047)",
              borderBottom: "none",
            }}
          >
            <h5 className="modal-title fw-bold text-uppercase">
              {t("buyerOrders.modal.title")} - {order.id}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label={t("common.close")}
            />
          </div>

          {/* Body */}
          <div className="modal-body p-4 bg-white">
            {/* Items List */}
            <div className="mb-4">
              <h5 className="fw-bold text-success mb-3">
                {t("buyerOrders.modal.itemsTitle")}
              </h5>
              {order.products.map((p, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between align-items-center py-2 border-bottom"
                >
                  <div>
                    <p className="mb-0 fw-semibold">{p.productName}</p>
                    <p className="small text-muted mb-0">
                      {p.quantity} × {translateUnit(p.unit)} @{" "}
                      {p.price.toFixed(2)} {t("payments.etb")}
                    </p>
                  </div>
                  <p className="fw-bold text-success">
                    {(p.price * p.quantity).toFixed(2)} {t("payments.etb")}
                  </p>
                </div>
              ))}
            </div>

            {/* Info Grid */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <p className="mb-1">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="me-2 text-muted"
                  />
                  {t("buyerOrders.modal.orderDate")}:{" "}
                  <strong>{order.orderDate}</strong>
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-1">
                  <FontAwesomeIcon icon={faTruck} className="me-2 text-muted" />
                  {t("buyerOrders.modal.expectedDelivery")}:{" "}
                  <strong>{formatDeliveryDate(order.deliveryDate)}</strong>
                </p>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <p className="mb-1">
                  <FontAwesomeIcon icon={faUser} className="me-2 text-muted" />
                  {t("buyerOrders.modal.farmer")}:{" "}
                  <strong>{order.farmerName}</strong>
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-1">
                  <FontAwesomeIcon
                    icon={faMoneyBillWave}
                    className="me-2 text-muted"
                  />
                  {t("buyerOrders.modal.totalAmount")}:{" "}
                  <strong className="text-success">
                    {order.totalAmount.toFixed(2)} {t("payments.etb")}
                  </strong>
                </p>
              </div>
            </div>

            {/* Status + Cancel Button */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <span className={`badge px-4 py-2 fs-6 ${badgeFn(order.status)}`}>
                {translateStatus(order.status)}
              </span>

              {canCancel && (
                <button
                  className="btn btn-danger px-4"
                  onClick={() => onCancelOrder(order.id)}
                >
                  <FontAwesomeIcon icon={faBan} className="me-2" />
                  {t("buyerOrders.modal.cancelOrder")}
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light">
            <button className="btn btn-outline-success" onClick={onClose}>
              {t("common.close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")
  );
};

export default OrderDetailModal;
