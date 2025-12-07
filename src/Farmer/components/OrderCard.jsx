// src/Farmer/components/OrderCard.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";

const OrderCard = ({ order, onViewDetails, onCancelOrder }) => {
  const { t } = useTranslation();
  const canCancel = ["pending", "processing"].includes(
    order.status.toLowerCase()
  );

  // === PARSE FIRST PRODUCT + TRANSLATE UNIT ===
  const getFirstProduct = () => {
    const first = order.products?.[0];
    if (!first) return null;

    let name = "Unknown",
      quantity = 1,
      unitKey = "";

    // Case 1: Object
    if (typeof first === "object" && first !== null && first.productName) {
      name = first.productName;
      quantity = parseInt(first.quantity, 10) || 1;
      unitKey = first.unit || "";
    }
    // Case 2: String
    else if (typeof first === "string") {
      const complex = first.match(
        /^(.+?)\s*$$ (\d+)\s+(.+?)\s*\(\s*([^ $$]+)\s*\)\)$/
      );
      if (complex) {
        const [, n, q, u, abbrev] = complex;
        name = n.trim();
        quantity = parseInt(q, 10);
        unitKey = `${u.trim()} (${abbrev.trim()})`;
      } else {
        const simple = first.match(/^(.+?)\s*$$ (\d+)\s+([^ $$]+)\)$/);
        if (simple) {
          const [, n, q, u] = simple;
          name = n.trim();
          quantity = parseInt(q, 10);
          unitKey = u.trim();
        } else {
          name = first.trim();
        }
      }
    }

    // Translate unit key → fallback to original
    const translatedUnit = unitKey ? t(`units.${unitKey}`, unitKey) : "";

    return { name, quantity, unit: translatedUnit };
  };

  const firstProduct = getFirstProduct();

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold mb-0">
            {firstProduct?.name || t("products.noProducts")} -{" "}
            <span className="text-muted">{order.orderId}</span>
          </h6>
          <span
            className={`badge ${
              order.status === "delivered"
                ? "bg-success"
                : order.status === "in transit"
                ? "bg-primary"
                : order.status === "cancelled"
                ? "bg-danger"
                : ["pending", "processing"].includes(order.status)
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
          >
            {t(`orders.${order.status}`)}
          </span>
        </div>

        <p className="text-muted small mb-2">
          {t("roles.buyer")}: {order.buyerName} | {t("common.phone")}:{" "}
          {order.buyerPhone}
        </p>

        {firstProduct && (
          <p className="small text-muted mb-2">
            {firstProduct.quantity} × {firstProduct.unit}
            {order.products.length > 1 && (
              <span className="text-muted">
                {" "}
                + {order.products.length - 1} {t("common.more")}
              </span>
            )}
          </p>
        )}

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
