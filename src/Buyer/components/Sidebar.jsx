import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../Css/sidebar.css";
import {
  FaChartBar,
  FaCube,
  FaShoppingCart,
  FaChartLine,
  FaBell,
  FaCog,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Hamburger / Close Button for small & medium devices */}
      <button
        className="hamburger btn btn-success d-lg-none m-2"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: 2000,
        }}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar bg-white border-end d-lg-block ${
          isOpen ? "mobile-sidebar-open" : "mobile-sidebar-closed"
        }`}
        style={{
          position: "fixed",
          left: 0,
          top: "60px", // Offset for navbar height
          height: "calc(100vh - 60px)",
          width: "250px",
          padding: "20px",
          zIndex: 1500,
        }}
      >
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              to="/buyer/dashboard"
              className={`nav-link ${
                isActive("/buyer/dashboard")
                  ? "active-link text-primary fw-bold"
                  : "text-dark"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaChartBar className="me-2" />
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/products"
              className={`nav-link ${
                isActive("/products")
                  ? "active-link text-primary fw-bold"
                  : "text-dark"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaCube className="me-2" />
              Browse Products
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/buyer/orders"
              className={`nav-link ${
                isActive("/buyer/orders")
                  ? "active-link text-primary fw-bold"
                  : "text-dark"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaShoppingCart className="me-2" />
              My Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/buyer/settings"
              className={`nav-link ${
                isActive("/buyer/settings")
                  ? "active-link text-primary fw-bold"
                  : "text-dark"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaCog className="me-2" />
              Settings
            </Link>
          </li>
        </ul>

        <div className="user-info d-flex align-items-center mt-4">
          <FaUser className="me-2 fs-4 text-secondary" />
          <div>
            <div className="fw-bold">Demo User</div>
            <div className="text-muted small">Buyer</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
