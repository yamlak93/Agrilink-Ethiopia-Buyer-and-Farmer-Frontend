import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCalendarAlt,
  faBoxOpen,
  faUser,
  faMoneyBillWave,
  faTruck,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderDetailModal = ({ isVisible, order, onClose, onCancelOrder }) => {
  useEffect(() => {
    const modalRoot = document.getElementById("order-detail-modal-root");
    if (!modalRoot) {
      const newModalRoot = document.createElement("div");
      newModalRoot.setAttribute("id", "order-detail-modal-root");
      document.body.appendChild(newModalRoot);
    }
    return () => {
      const existingModalRoot = document.getElementById(
        "order-detail-modal-root"
      );
      if (existingModalRoot) {
        document.body.removeChild(existingModalRoot);
      }
    };
  }, []);

  if (!isVisible || !order) return null;

  const isPending = order.status === "Pending";

  const modalContent = (
    <div
      className={`modal fade ${isVisible ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1050,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg rounded-3">
          <div
            className="modal-header text-white"
            style={{
              background: "linear-gradient(90deg, #2e7d32, #43a047)",
              borderBottom: "none",
              padding: "1rem 1.5rem",
            }}
          >
            <h5 className="modal-title fw-semibold text-uppercase">
              Order Details - {order.orderId}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4 bg-white">
            <h4 className="fw-bold mb-3 text-success">{order.productName}</h4>
            <p className="text-muted small mb-3">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Farmer: <strong>{order.farmerName}</strong> | Location:{" "}
              {order.location}
            </p>

            <div className="row mb-3">
              <div className="col-md-6">
                <p className="mb-1">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="me-2 text-muted"
                  />
                  Order Date:{" "}
                  <span className="fw-semibold">{order.orderDate}</span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-1">
                  <FontAwesomeIcon icon={faTruck} className="me-2 text-muted" />
                  Delivery Date:{" "}
                  <span className="fw-semibold">{order.deliveryDate}</span>
                </p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <p className="mb-1">
                  <FontAwesomeIcon
                    icon={faBoxOpen}
                    className="me-2 text-muted"
                  />
                  Quantity:{" "}
                  <span className="fw-semibold">
                    {order.quantity} {order.unit}
                  </span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-1">
                  <FontAwesomeIcon
                    icon={faMoneyBillWave}
                    className="me-2 text-muted"
                  />
                  Total Price:{" "}
                  <span className="fw-semibold text-success">
                    {order.totalPrice} ETB
                  </span>
                </p>
              </div>
            </div>

            <p className="mb-3">
              <span
                className={`badge px-3 py-2 ${
                  order.status === "Delivered"
                    ? "bg-success"
                    : order.status === "Shipped"
                    ? "bg-primary"
                    : order.status === "Pending"
                    ? "bg-warning text-dark"
                    : "bg-secondary"
                }`}
              >
                Status: {order.status}
              </span>
            </p>

            {isPending && (
              <div className="mt-4 text-center">
                <button
                  className="btn btn-danger px-4"
                  onClick={() => onCancelOrder(order.id)}
                >
                  <FontAwesomeIcon icon={faBan} className="me-2" />
                  Cancel Order
                </button>
              </div>
            )}
          </div>

          <div
            className="modal-footer bg-light border-top"
            style={{ padding: "1rem 1.5rem" }}
          >
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("order-detail-modal-root")
  );
};

export default OrderDetailModal;
