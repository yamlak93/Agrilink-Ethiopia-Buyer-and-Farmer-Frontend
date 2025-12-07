import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import translation
import "../../Css/Sidebar.css";
import {
  FaChartBar,
  FaCube,
  FaShoppingCart,
  FaCog,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const { t } = useTranslation(); // Initialize translation
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Demo User");

  const isActive = (path) => location.pathname === path;

  // === GET USER NAME FROM localStorage OR TOKEN ===
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "Demo User");
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserName(payload.name || payload.username || "Demo User");
        } catch (err) {
          console.error("Failed to decode token:", err);
        }
      }
    }
  }, []);

  return (
    <>
      {/* Hamburger Button (Mobile) */}
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
          top: "60px",
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
              {t("navigation.dashboard")}
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
              {t("navigation.browseProducts")}
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
              {t("navigation.orders")}
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
              {t("navigation.settings")}
            </Link>
          </li>
        </ul>

        {/* User Info */}
        <div className="user-info d-flex align-items-center mt-4">
          <FaUser className="me-2 fs-4 text-secondary" />
          <div>
            <div className="fw-bold">{userName}</div>
            <div className="text-muted small">{t("roles.buyer")}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
