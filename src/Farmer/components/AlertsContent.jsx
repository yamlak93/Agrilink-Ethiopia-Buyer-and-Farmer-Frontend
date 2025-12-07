import React, { useState, useEffect } from "react";
import TipCard from "./TipCard";
import Loader from "../../assets/Agriculture Loader.webm";
import apiClient from "../../api/api"; // Import the api.js client
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const AlertsContent = () => {
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token available");
        }

        const response = await apiClient.get("/tips/alerts");
        setAlertsData(response.data.alerts || []);
      } catch (err) {
        console.error(
          "Failed to fetch alerts:",
          err.response?.data || err.message
        );
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", {
            replace: true,
            state: { message: "Session expired. Please log in again." },
          });
          return;
        }
        setError("Failed to load alerts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [navigate]);

  return (
    <div>
      {loading && (
        <div
          className="text-center"
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            autoPlay
            loop
            muted
            style={{
              width: "300px",
              height: "300px",
              display: "block",
              margin: "0 auto",
            }}
          >
            <source src={Loader} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      {error && <div className="text-center text-danger">{error}</div>}
      {!loading && !error && (
        <>
          {alertsData.length > 0 ? (
            alertsData.map((alert) => (
              <TipCard
                key={alert.alertId}
                title={alert.title}
                category={alert.category}
                date={alert.date}
                content={alert.content}
              />
            ))
          ) : (
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">🚨 No New Alerts</h5>
                <p className="card-text">
                  Check back later for important updates and alerts regarding
                  weather, pests, or market changes.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlertsContent;
