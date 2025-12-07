// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import logoGreen from "../../assets/logoGreen.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import CartIcon from "./CartIcon";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [userName, setUserName] = useState("Guest");
  const [userId, setUserId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] =
    useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === "Buyer") {
          setUserName(user.name || "User");
          setUserId(user.id);
        } else {
          setUserName("Guest");
        }
      } catch (e) {
        console.error("Failed to parse user data");
        setUserName("Guest");
      }
    }

    // Load saved language
    const savedLanguage = localStorage.getItem("userLanguage");
    if (savedLanguage && ["en", "am", "om"].includes(savedLanguage)) {
      setSelectedLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("agrilink_cart");
    navigate("/login");
  };

  const handleLanguageSelect = (value) => {
    i18n.changeLanguage(value);
    setSelectedLanguage(value);
    setIsLanguageDropdownVisible(false);
    localStorage.setItem("userLanguage", value);
  };

  return (
    <nav
      className="navbar navbar-light bg-light shadow-sm"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1050,
        height: "60px",
      }}
    >
      <div className="container-fluid">
        <div className="d-flex flex-row justify-content-between align-items-center w-100 p-2">
          {/* Logo and Text */}
          <div className="d-flex align-items-center">
            <img src={logoGreen} width={36} alt="Logo" className="me-2" />
            <span className="fw-bold text-success d-none d-lg-inline">
              {t("app.title")}
            </span>
          </div>

          {/* Welcome Text */}
          <div className="flex-grow-1 mx-3 text-center">
            <span
              className="welcome-text"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                fontWeight: "600",
                color: "#2ecc71",
                maxWidth: "250px",
                display: "inline-block",
              }}
            >
              {t("dashboard.welcome", {
                userName: userName || t("common.guest"),
              })}
            </span>
          </div>

          {/* Right-Side Elements */}
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            {/* Cart */}
            <CartIcon userId={userId} />

            {/* Globe Icon + Mobile Dropdown */}
            <div className="d-inline d-lg-none position-relative">
              <FontAwesomeIcon
                icon={faGlobe}
                size="lg"
                className="text-secondary"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setIsLanguageDropdownVisible(!isLanguageDropdownVisible)
                }
              />
              {isLanguageDropdownVisible && (
                <div
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                    minWidth: "100px",
                  }}
                >
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageSelect("en");
                    }}
                  >
                    {t("settings.languageList.english")}
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageSelect("am");
                    }}
                  >
                    {t("settings.languageList.amharic")}
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageSelect("om");
                    }}
                  >
                    {t("settings.languageList.oromo")}
                  </a>
                </div>
              )}
            </div>

            {/* Desktop Language Select */}
            <select
              className="form-select bg-light text-dark d-none d-lg-inline"
              style={{
                width: "70px",
                height: "28px",
                borderRadius: "6px",
                border: "2px solid green",
                padding: "2px",
                fontSize: "12px",
              }}
              value={selectedLanguage}
              onChange={(e) => handleLanguageSelect(e.target.value)}
            >
              <option value="en">{t("settings.languageList.english")}</option>
              <option value="am">{t("settings.languageList.amharic")}</option>
              <option value="om">{t("settings.languageList.oromo")}</option>
            </select>

            {/* Logout */}
            <FontAwesomeIcon
              icon={faSignOutAlt}
              style={{ color: "red", cursor: "pointer" }}
              title={t("auth.logout")}
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
