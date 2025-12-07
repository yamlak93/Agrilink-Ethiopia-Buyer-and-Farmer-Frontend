// src/Buyer/components/OrderCard.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

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

const OrderCard = ({ order, onViewDetails }) => {
  const { t } = useTranslation();
  const first = order.products[0];

  // === TRANSLATE UNIT ===
  const translateUnit = (unit) =>
    t(`units.${unit?.toLowerCase().trim()}`, { defaultValue: unit });

  // === TRANSLATE STATUS (100% i18n) ===
  const translateStatus = (status) => {
    const key = status?.toLowerCase().replace(/\s+/g, "_");
    return t(`buyerOrders.tabs.${key}`, { defaultValue: status });
  };

  return (
    <div className="card shadow-sm mb-3 border-0 rounded-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="fw-bold text-success mb-1">
              {t("buyerOrders.card.orderId", { id: order.id })}
            </h6>
            <p className="small text-muted mb-1">
              {first?.productName} × {first?.quantity}{" "}
              {translateUnit(first?.unit)}
              {order.products.length > 1 && (
                <span className="text-muted">
                  {" "}
                  {t("buyerOrders.card.moreItems", {
                    count: order.products.length - 1,
                  })}
                </span>
              )}
            </p>
            <p className="small text-muted mb-0">
              <FontAwesomeIcon icon={faUser} className="me-1" />
              {t("buyerOrders.card.farmer")}:{" "}
              <strong>{order.farmerName}</strong>
            </p>
          </div>

          <div className="text-end">
            <p className="fw-bold text-success fs-5 mb-1">
              {order.totalAmount.toFixed(2)} {t("payments.etb")}
            </p>
            <span
              className={`badge px-3 py-1 fs-6 ${getStatusBadge(order.status)}`}
            >
              {translateStatus(order.status)}
            </span>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
            {order.orderDate}
          </small>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => onViewDetails(order)}
          >
            {t("buyerOrders.card.viewDetails")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
