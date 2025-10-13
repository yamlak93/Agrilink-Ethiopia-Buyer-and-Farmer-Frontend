import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next"; // ✅ i18n hook

const OrderCard = ({ order, onViewDetails, onCancelOrder }) => {
  const canCancel = ["pending", "processing"].includes(
    order.status.toLowerCase()
  ); // Changed to lowercase
  const { t } = useTranslation();

  const getStatusLabel = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return t("orders.pending");
      case "processing":
        return t("orders.processing");
      case "in transit":
        return t("delivery.inTransit");
      case "delivered":
        return t("orders.delivered");
      case "cancelled":
        return t("orders.cancelled");
      default:
        return status;
    }
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold mb-0">
            {order.product} -{" "}
            <span className="text-muted">{order.orderId}</span>
          </h6>
          <span
            className={`badge ${
              order.status.toLowerCase() === "delivered"
                ? "bg-success"
                : order.status.toLowerCase() === "in transit"
                ? "bg-primary"
                : order.status.toLowerCase() === "cancelled"
                ? "bg-danger"
                : ["pending", "processing"].includes(order.status.toLowerCase())
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>
        <p className="text-muted small mb-2">
          {t("roles.buyer")}: {order.buyerName} | {t("common.phone")}:{" "}
          {order.buyerPhone}
        </p>

        <div className="row align-items-center mb-3">
          <div className="col-md-4">
            <p className="mb-1">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="me-2 text-muted"
              />
              {t("orders.orderdate")}: {order.date}
            </p>
          </div>
          <div className="col-md-4">
            <p className="mb-1">
              <FontAwesomeIcon icon={faBoxOpen} className="me-2 text-muted" />
              {t("common.quantity")}: {order.quantity}
            </p>
          </div>
          <div className="col-md-4">
            <p className="mb-1">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="me-2 text-muted"
              />
              {t("delivery.deliverydate")}:{" "}
              {order.deliveryDate || t("common.na")}
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-success mb-0">
            {t("common.total")}: {order.total} {t("payments.etb")}
          </h5>
          <div>
            <button
              className="btn btn-outline-success btn-sm me-2"
              onClick={() => onViewDetails(order)}
            >
              {t("products.viewDetails")}
            </button>
            {canCancel && (
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onCancelOrder(order)}
              >
                {t("orders.cancelOrder")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
