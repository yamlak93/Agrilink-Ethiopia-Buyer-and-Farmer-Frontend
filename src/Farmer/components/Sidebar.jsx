import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ Import translation hook
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
  const { t } = useTranslation(); // ✅ Initialize translation
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Demo User");

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || "Demo User");
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
      {/* Hamburger Button */}
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
          top: "56px",
          height: "calc(100vh - 56px)",
          width: "220px",
          zIndex: 1500,
        }}
      >
        <ul className="nav flex-column mt-3">
          <li className="nav-item">
            <Link
              to="/farmer/dashboard"
              className={`nav-link ${
                isActive("/farmer/dashboard") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaChartBar className="me-2" />
              {t("navigation.dashboard")}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/farmer/products"
              className={`nav-link ${
                isActive("/farmer/products") || isActive("/farmer/add-product")
                  ? "active-link"
                  : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaCube className="me-2" />
              {t("navigation.products")}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/farmer/orders"
              className={`nav-link ${
                isActive("/farmer/orders") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaShoppingCart className="me-2" />
              {t("navigation.orders")}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/farmer/analytics"
              className={`nav-link ${
                isActive("/farmer/analytics") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaChartLine className="me-2" />
              {t("navigation.analytics")}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/farmer/tips"
              className={`nav-link ${
                isActive("/farmer/tips") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaBell className="me-2" />
              {t("navigation.tips")}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/farmer/settings"
              className={`nav-link ${
                isActive("/farmer/settings") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaCog className="me-2" />
              {t("navigation.settings")}
            </Link>
          </li>
        </ul>

        {/* User Info */}
        <div className="user-info d-flex align-items-center mt-4 px-3 py-2">
          <FaUser className="me-2 fs-4 text-secondary" />
          <div>
            <div className="fw-bold">{userName}</div>
            <div className="text-muted small">{t("roles.farmer")}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
