import React, { useState, useEffect } from "react";
import TipCard from "./TipCard";
import axios from "axios";
import Loader from "../../assets/Agriculture Loader.webm"; // Added loader import

const AlertsContent = () => {
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token available");
        }

        const response = await axios.get(
          "http://localhost:5000/api/tips/alerts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAlertsData(response.data.alerts || []);
      } catch (err) {
        console.error(
          "Failed to fetch alerts:",
          err.response?.data || err.message
        );
        setError("Failed to load alerts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

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
