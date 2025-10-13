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

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error rendering modal. Please try again.</div>;
    }
    return this.props.children;
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
    if (order) {
      setCurrentStatus(order.status.toLowerCase());
      setErrorMessage("");
    }
  }, [order]);

  const handleUpdateStatus = async (newStatus) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.patch(
        `http://localhost:5000/api/orders/${order.orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentStatus(newStatus);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      setErrorMessage(
        err.response?.data?.message || t("errors.statusUpdateFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!order || !isVisible) return null;

  const statusSteps = [
    { raw: "pending", label: t("orders.pending") },
    { raw: "processing", label: t("orders.processing") },
    { raw: "in transit", label: t("delivery.inTransit") },
    { raw: "delivered", label: t("orders.delivered") },
    { raw: "cancelled", label: t("orders.cancelled") },
  ];

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-success";
      case "in transit":
        return "bg-primary";
      case "pending":
      case "processing":
        return "bg-warning text-dark";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const getStatusLabel = (status) => {
    return (
      statusSteps.find((step) => step.raw === status.toLowerCase())?.label ||
      status
    );
  };

  const getStepIcon = (step) => {
    switch (step.raw) {
      case "pending":
        return <FaClock />;
      case "processing":
        return <FaSpinner />;
      case "in transit":
        return <FaTruck />;
      case "delivered":
        return <FaCheckCircle />;
      case "cancelled":
        return <FaTimesCircle />;
      default:
        return null;
    }
  };

  const currentStatusIndex = statusSteps.findIndex(
    (step) => step.raw === currentStatus.toLowerCase()
  );

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
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong className="text-muted">
                      {t("common.product")}:
                    </strong>{" "}
                    <span className="text-dark">
                      {order.products.map((p) => p.productName).join(", ")}
                    </span>
                  </p>
                  <p className="mb-2">
                    <strong className="text-muted">{t("roles.buyer")}:</strong>{" "}
                    <span className="text-dark">{order.buyerName}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="text-muted">{t("common.phone")}:</strong>{" "}
                    <span className="text-dark">{order.buyerPhone}</span>
                  </p>
                  {order.deliveryDate && (
                    <p className="mb-2">
                      <strong className="text-muted">
                        {t("delivery.deliverydate")}:
                      </strong>{" "}
                      <span className="text-dark">{order.deliveryDate}</span>
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong className="text-muted">
                      {t("common.quantity")}:
                    </strong>{" "}
                    <span className="text-dark">{order.quantity}</span>
                  </p>
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
                      {getStatusLabel(currentStatus)}
                    </span>
                    {order.updatedAt && (
                      <span
                        className="ms-2 text-muted"
                        style={{ fontSize: "0.9em" }}
                      >
                        ({t("common.updatedAt")}:{" "}
                        {new Date(order.updatedAt).toLocaleString()})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-success">
                {t("common.timeline")}
              </h5>
              <div className="d-flex justify-content-between align-items-center mb-3">
                {statusSteps.slice(0, 4).map((step, index) => {
                  const isActive = step.raw === currentStatus.toLowerCase();
                  const isCompleted = currentStatusIndex > index;
                  const isClickable =
                    (Math.abs(index - currentStatusIndex) === 1 &&
                      currentStatus.toLowerCase() !== "delivered" &&
                      currentStatus.toLowerCase() !== "cancelled") ||
                    (currentStatus.toLowerCase() === "pending" && index === 1);

                  return (
                    <div
                      key={step.raw}
                      className="text-center flex-grow-1"
                      style={{
                        cursor:
                          isClickable && !isLoading ? "pointer" : "default",
                        opacity: isClickable && !isLoading ? 1 : 0.6,
                      }}
                      title={
                        isClickable ? `Click to update to ${step.label}` : ""
                      }
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
                        } text-white d-flex align-items-center justify-content-center`}
                        style={{
                          width: "30px",
                          height: "30px",
                          margin: "0 auto",
                          fontSize: "16px",
                        }}
                      >
                        {getStepIcon(step)}
                      </div>
                      <p
                        className={`mt-2 ${isActive ? "fw-bold" : ""} ${
                          isCompleted ? "text-success" : ""
                        }`}
                        style={{ fontSize: "12px" }}
                      >
                        {step.label}
                      </p>
                      {isActive && order.updatedAt && (
                        <p
                          className="text-muted"
                          style={{ fontSize: "10px", marginTop: "-5px" }}
                        >
                          {t("common.updatedAt")}:{" "}
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong className="text-muted">
                      {t("orders.orderdate")}:
                    </strong>{" "}
                    <span className="text-dark">{order.date}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong className="text-muted">
                      {t("delivery.deliverydate")}:
                    </strong>{" "}
                    <span className="text-dark">
                      {order.deliveryDate || t("common.na")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer
          className="justify-content-start"
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
