import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderCard = ({ order, onViewDetails }) => {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold mb-0">
            {order.productName} -{" "}
            <span className="text-muted">{order.orderId}</span>
          </h6>
          <span
            className={`badge ${
              order.status === "Delivered"
                ? "bg-success"
                : order.status === "Shipped"
                ? "bg-primary"
                : order.status === "Pending"
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
          >
            {order.status}
          </span>
        </div>
        <p className="text-muted small mb-2">
          Farmer: {order.farmerName} | Location: {order.location}
        </p>

        <div className="row align-items-center mb-3">
          <div className="col-md-4">
            <p className="mb-1">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="me-2 text-muted"
              />
              Order Date: {order.orderDate}
            </p>
          </div>
          <div className="col-md-4">
            <p className="mb-1">
              <FontAwesomeIcon icon={faBoxOpen} className="me-2 text-muted" />
              Quantity: {order.quantity} {order.unit}
            </p>
          </div>
          <div className="col-md-4">
            <p className="mb-1">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="me-2 text-muted"
              />
              Delivery Date: {order.deliveryDate}
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-success mb-0">
            Total: {order.totalPrice} ETB
          </h5>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => onViewDetails(order)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
