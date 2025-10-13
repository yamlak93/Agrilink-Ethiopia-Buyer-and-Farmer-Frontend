import React, { useState, useEffect } from "react";
import logoGreen from "../../assets/logoGreen.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faBell,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
// 1. Import useNavigate for redirection
import { useNavigate } from "react-router-dom";
import NotificationModal from "./NotificationModal";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Navbar = () => {
  const { t, i18n } = useTranslation(); // Initialize i18n translation
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [userName, setUserName] = useState("");
  const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] =
    useState(false); // State for mobile language dropdown
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default to English

  // Initialize the navigate function
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || "Guest");
    }
    // Retrieve saved language from localStorage
    const savedLanguage = localStorage.getItem("userLanguage");
    if (savedLanguage && ["en", "am", "om"].includes(savedLanguage)) {
      setSelectedLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
    fetchUnreadNotifications(); // Fetch initial unread count
    const interval = setInterval(fetchUnreadNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Load existing notifications from localStorage
      const storedNotifications = JSON.parse(
        localStorage.getItem("notifications") || "[]"
      );
      const allNotifications = response.data.map((notif) => {
        const storedNotif = storedNotifications.find((n) => n.id === notif.id);
        return { ...notif, isRead: storedNotif?.isRead || false };
      });

      // Count only unread notifications
      const unreadCount = allNotifications.filter(
        (notif) => !notif.isRead
      ).length;
      setUnreadNotifications(unreadCount);

      // Update localStorage
      localStorage.setItem("notifications", JSON.stringify(allNotifications));
    } catch (err) {
      console.error("Failed to fetch unread notifications:", err);
      setUnreadNotifications(0);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    // Do not reset unread count here; it will be handled by fetchUnreadNotifications
  };

  const handleLogout = () => {
    // Remove the token and user details from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("notifications"); // Clear notifications on logout

    // Redirect the user to the login page
    navigate("/login");
  };

  const handleLanguageSelect = (value) => {
    i18n.changeLanguage(value); // Change language using i18n
    setSelectedLanguage(value); // Update selectedLanguage state
    setIsLanguageDropdownVisible(false); // Close dropdown after selection
    localStorage.setItem("userLanguage", value); // Save to localStorage
    console.log("Selected language:", value); // Debug log
  };

  return (
    <>
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
            <div
              className="d-flex align-items-center position-relative"
              style={{ gap: "10px" }}
            >
              <div
                className="position-relative"
                onClick={toggleModal}
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon
                  icon={faBell}
                  size="lg"
                  className="text-secondary"
                />
                {unreadNotifications > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unreadNotifications}
                  </span>
                )}
              </div>

              {/* Globe Icon with Dropdown for Small Devices */}
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
                      onClick={() => handleLanguageSelect("en")}
                    >
                      {t("settings.languageList.english")}
                    </a>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleLanguageSelect("am")}
                    >
                      {t("settings.languageList.amharic")}
                    </a>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleLanguageSelect("om")}
                    >
                      {t("settings.languageList.oromo")}
                    </a>
                  </div>
                )}
              </div>

              {/* Language Dropdown for Large Devices */}
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
                onChange={(e) => {
                  const value = e.target.value;
                  handleLanguageSelect(value);
                }}
              >
                <option value="en">{t("settings.languageList.english")}</option>
                <option value="am">{t("settings.languageList.amharic")}</option>
                <option value="om">{t("settings.languageList.oromo")}</option>
              </select>

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
      <NotificationModal isVisible={isModalVisible} onClose={toggleModal} />
    </>
  );
};

export default Navbar;
