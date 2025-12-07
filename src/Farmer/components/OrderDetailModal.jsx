// src/Farmer/components/OrderDetailModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../Css/OrderDetailModal.css";
import {
  FaClock,
  FaSpinner,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import StylishModal from "./StylishModal";
import LoadingModal from "../../others/LoadingPage";
import { useTranslation } from "react-i18next";
import axios from "axios";

class ModalErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? (
      <div>Error rendering modal.</div>
    ) : (
      this.props.children
    );
  }
}

const OrderDetailModal = ({
  isVisible,
  order,
  onClose,
  onCancelOrder,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [currentStatus, setCurrentStatus] = useState(
    order?.status || "pending"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (order) setCurrentStatus(order.status.toLowerCase());
  }, [order]);

  const handleUpdateStatus = async (newStatus) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/orders/${order.orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentStatus(newStatus);
      onRefresh?.();
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || t("errors.statusUpdateFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!order || !isVisible) return null;

  // === PARSE PRODUCTS WITH UNIT TRANSLATION ===
  const parseProducts = (productsArr) => {
    if (!Array.isArray(productsArr)) return [];

    return productsArr.map((item) => {
      let name = "Unknown",
        quantity = 1,
        unitKey = "",
        price = 0;

      // Case 1: Full object
      if (typeof item === "object" && item !== null) {
        name = item.productName || item.name || name;
        quantity = parseInt(item.quantity, 10) || quantity;
        unitKey = item.unit || "";
        price = parseFloat(item.price) || price;
      }
      // Case 2: String format
      else if (typeof item === "string") {
        const complex = item.match(
          /^(.+?)\s*$$ (\d+)\s+(.+?)\s*\(\s*([^ $$]+)\s*\)\)$/
        );
        if (complex) {
          const [, n, q, u, abbrev] = complex;
          name = n.trim();
          quantity = parseInt(q, 10);
          unitKey = `${u.trim()} (${abbrev.trim()})`;
        } else {
          const simple = item.match(/^(.+?)\s*$$ (\d+)\s+([^ $$]+)\)$/);
          if (simple) {
            const [, n, q, u] = simple;
            name = n.trim();
            quantity = parseInt(q, 10);
            unitKey = u.trim();
          } else {
            name = item.trim();
          }
        }
      }

      // Translate unit key → fallback to original
      const translatedUnit = unitKey ? t(`units.${unitKey}`, unitKey) : "";

      return {
        name,
        quantity,
        unit: translatedUnit,
        price,
        total: quantity * price,
      };
    });
  };

  const productList = parseProducts(order.products || []);

  const statusSteps = [
    { raw: "pending", label: t("orders.pending") },
    { raw: "processing", label: t("orders.processing") },
    { raw: "in transit", label: t("delivery.inTransit") },
    { raw: "delivered", label: t("orders.delivered") },
    { raw: "cancelled", label: t("orders.cancelled") },
  ];

  const getStatusBadgeClass = (status) => {
    const s = status.toLowerCase();
    return s === "delivered"
      ? "bg-success"
      : s === "in transit"
      ? "bg-primary"
      : s === "cancelled"
      ? "bg-danger"
      : ["pending", "processing"].includes(s)
      ? "bg-warning text-dark"
      : "bg-secondary";
  };

  const currentIndex = statusSteps.findIndex((s) => s.raw === currentStatus);

  return (
    <ModalErrorBoundary>
      <Modal show={isVisible} onHide={onClose} centered size="lg">
        <Modal.Header
          closeButton
          className="text-white"
          style={{
            background: "linear-gradient(90deg, #2e7d32, #43a047)",
            borderBottom: "none",
          }}
        >
          <Modal.Title className="fw-semibold text-uppercase fs-5">
            {t("orders.orderDetail")} {t("common.id")}: {order.orderId}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-white px-4 py-3">
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title text-success">
                {t("orders.orderSummary")}
              </h5>

              {/* BUYER-STYLE ITEMS LIST WITH TRANSLATED UNITS */}
              <div className="mb-4">
                <h6 className="fw-bold text-success mb-3">
                  {t("common.products")}
                </h6>
                {productList.map((p, i) => (
                  <div
                    key={i}
                    className="d-flex justify-content-between align-items-center py-2 border-bottom"
                  >
                    <div>
                      <p className="mb-0 fw-semibold">{p.name}</p>
                      <p className="small text-muted mb-0">
                        {p.quantity} × {p.unit}{" "}
                        {p.price > 0 && `@ ${p.price.toFixed(2)} ETB`}
                      </p>
                    </div>
                    <p className="fw-bold text-success">
                      {p.total > 0 ? p.total.toFixed(2) : "—"} ETB
                    </p>
                  </div>
                ))}
              </div>

              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong className="text-muted">{t("roles.buyer")}:</strong>{" "}
                    {order.buyerName}
                  </p>
                  <p className="mb-2">
                    <strong className="text-muted">{t("common.phone")}:</strong>{" "}
                    {order.buyerPhone}
                  </p>
                  {order.deliveryDate && (
                    <p className="mb-2">
                      <strong className="text-muted">
                        {t("delivery.deliverydate")}:
                      </strong>{" "}
                      {order.deliveryDate}
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong className="text-muted">{t("common.total")}:</strong>{" "}
                    <span className="text-success fw-semibold">
                      {order.total} {t("payments.etb")}
                    </span>
                  </p>
                  <p className="mb-2">
                    <strong className="text-muted">
                      {t("common.status")}:
                    </strong>{" "}
                    <span
                      className={`badge ${getStatusBadgeClass(
                        currentStatus
                      )} px-2 py-1`}
                    >
                      {statusSteps.find((s) => s.raw === currentStatus)
                        ?.label || currentStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TIMELINE (UNCHANGED) */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-success">
                {t("common.timeline")}
              </h5>
              <div className="d-flex justify-content-between align-items-center mb-3">
                {statusSteps.slice(0, 4).map((step, i) => {
                  const isActive = step.raw === currentStatus;
                  const isCompleted = currentIndex > i;
                  const isClickable =
                    Math.abs(i - currentIndex) === 1 &&
                    currentStatus !== "delivered" &&
                    currentStatus !== "cancelled";

                  return (
                    <div
                      key={step.raw}
                      className="text-center flex-grow-1"
                      style={{
                        cursor:
                          isClickable && !isLoading ? "pointer" : "default",
                        opacity: isClickable ? 1 : 0.6,
                      }}
                      onClick={
                        isClickable && !isLoading
                          ? () => handleUpdateStatus(step.raw)
                          : null
                      }
                    >
                      <div
                        className={`rounded-circle ${
                          isCompleted
                            ? "bg-success"
                            : isActive
                            ? "bg-primary"
                            : "bg-light"
                        } text-white d-flex align-items-center justify-content-center mx-auto`}
                        style={{
                          width: "30px",
                          height: "30px",
                          fontSize: "16px",
                        }}
                      >
                        {step.raw === "pending" ? (
                          <FaClock />
                        ) : step.raw === "processing" ? (
                          <FaSpinner />
                        ) : step.raw === "in transit" ? (
                          <FaTruck />
                        ) : step.raw === "delivered" ? (
                          <FaCheckCircle />
                        ) : null}
                      </div>
                      <p
                        className={`mt-2 small ${isActive ? "fw-bold" : ""} ${
                          isCompleted ? "text-success" : ""
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer
          style={{ background: "#f0f4f0", borderTop: "1px solid #d0e0d0" }}
        >
          {(currentStatus === "pending" || currentStatus === "processing") && (
            <Button
              variant="outline-danger"
              disabled={isLoading}
              className="me-2"
              onClick={() => onCancelOrder(order)}
            >
              {t("orders.cancelOrder")}
            </Button>
          )}
          {currentStatus === "cancelled" && (
            <Button
              variant="outline-success"
              disabled={isLoading}
              className="me-2"
              onClick={() => handleUpdateStatus("pending")}
            >
              {isLoading ? t("common.updating") : t("orders.reopenOrder")}
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            {t("common.close")}
          </Button>
        </Modal.Footer>
      </Modal>

      <LoadingModal isLoading={isLoading} />
      <StylishModal
        isVisible={!!errorMessage}
        message={errorMessage}
        type="error"
        onClose={() => setErrorMessage("")}
      />
    </ModalErrorBoundary>
  );
};

export default OrderDetailModal;
