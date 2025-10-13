import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaClock, FaCheckCircle } from "react-icons/fa";

const recentOrders = [
  {
    id: 1,
    name: "Teff - Premium Quality",
    date: "May 12, 2023",
    price: "1,200 ETB",
    status: "Pending",
  },
  {
    id: 2,
    name: "Wheat Flour - Organic",
    date: "May 10, 2023",
    price: "850 ETB",
    status: "Completed",
  },
  {
    id: 3,
    name: "Barley - Fresh Harvest",
    date: "May 8, 2023",
    price: "950 ETB",
    status: "Pending",
  },
  {
    id: 4,
    name: "Maize - High Yield",
    date: "May 6, 2023",
    price: "700 ETB",
    status: "Completed",
  },
  {
    id: 5,
    name: "Sorghum - Organic",
    date: "May 4, 2023",
    price: "1,100 ETB",
    status: "Pending",
  },
];

const OrdersSection = () => {
  return (
    <div className="card shadow-sm p-4 h-100 border-0 rounded-3">
      <h5 className="fw-bold mb-2">📦 Recent Orders</h5>
      <p className="text-muted mb-4">Here are your latest purchases</p>

      {/* Scrollable orders list */}
      <div
        className="list-group"
        style={{
          maxHeight: "300px", // Fixed height
          overflowY: "auto", // Enable scroll if too many
          scrollbarWidth: "none", // Hide scrollbar (Firefox)
          msOverflowStyle: "none", // Hide scrollbar (IE/Edge)
        }}
      >
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 shadow-sm mb-2 rounded-3 p-3"
          >
            <div className="d-flex align-items-start">
              <FaShoppingBag className="text-success me-3 fs-4" />
              <div>
                <h6 className="mb-1 fw-semibold">{order.name}</h6>
                <small className="text-muted">Ordered on {order.date}</small>
              </div>
            </div>
            <div className="text-end">
              <span className="badge bg-light text-dark fs-6 px-3 py-2 shadow-sm mb-2">
                {order.price}
              </span>
              <br />
              <span
                className={`badge px-3 py-2 rounded-pill ${
                  order.status === "Pending"
                    ? "bg-warning text-dark"
                    : "bg-success"
                }`}
              >
                {order.status === "Pending" ? (
                  <FaClock className="me-1" />
                ) : (
                  <FaCheckCircle className="me-1" />
                )}
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/buyer/orders"
        className="mt-4 btn btn-outline-success w-100 fw-semibold shadow-sm"
      >
        View All Orders
      </Link>

      {/* Hide scrollbar (Chrome, Safari) */}
      <style>
        {`
          .list-group::-webkit-scrollbar {
            width: 0;
            background: transparent; /* make scrollbar transparent */
          }
        `}
      </style>
    </div>
  );
};

export default OrdersSection;
