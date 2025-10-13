import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationModal = ({ isVisible, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      fetchNotifications();
    }
  }, [isVisible]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token available");
        return;
      }

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
      const newNotifications = response.data.map((notif) => {
        const storedNotif = storedNotifications.find((n) => n.id === notif.id);
        return { ...notif, isRead: storedNotif?.isRead || false };
      });

      setNotifications(newNotifications);
      localStorage.setItem("notifications", JSON.stringify(newNotifications));
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleNotificationClick = (id, type) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    onClose(); // Close the modal

    // Redirect based on notification type
    switch (type) {
      case "order":
        navigate("/farmer/orders");
        break;
      case "tip":
        navigate("/farmer/tips");
        break;
      case "marketTrend":
        navigate("/farmer/market-trends");
        break;
      case "product":
        navigate("/farmer/products");
        break;
      default:
        navigate("/farmer/orders"); // Default fallback
    }
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    onClose(); // Close the modal after marking as read
  };

  if (!isVisible) return null;

  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const unreadNotifications = notifications.filter((notif) => !notif.isRead);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div
        className="bg-white rounded-4 shadow-lg"
        style={{
          width: "450px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "fadeIn 0.3s ease",
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
          <div>
            <h5 className="fw-bold mb-1">Notifications</h5>
            <small className="text-muted">{currentDate}</small>
          </div>
          <button
            className="btn btn-light btn-sm shadow-sm"
            onClick={onClose}
            style={{ fontWeight: "bold", fontSize: "1.2rem" }}
          >
            ×
          </button>
        </div>

        {/* Notification List */}
        <div
          className="flex-grow-1 overflow-auto p-3"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,0,0,0.2) transparent",
          }}
        >
          {unreadNotifications.length > 0 ? (
            unreadNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`d-flex flex-column p-3 mb-3 rounded-3 shadow-sm ${
                  !notif.isRead
                    ? "bg-light border-start border-4 border-primary"
                    : "bg-white"
                }`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}
                onClick={() => handleNotificationClick(notif.id, notif.type)}
              >
                <div className="d-flex justify-content-between">
                  <strong className="text-dark">{notif.title}</strong>
                  <small className="text-muted">
                    {new Date(notif.timestamp).toLocaleString()}
                  </small>
                </div>
                <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                  {notif.message}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted text-center">No new notifications</p>
          )}
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center p-3 border-top">
          <button
            className="btn btn-sm btn-primary"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        /* Transparent scrollbar for modern look */
        .overflow-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-auto::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.2);
          border-radius: 3px;
        }
        .overflow-auto:hover::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.4);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NotificationModal;
