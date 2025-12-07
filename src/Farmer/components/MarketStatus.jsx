import React, { useState, useEffect } from "react";
import Loader from "../../assets/Agriculture Loader.webm";
import { useTranslation } from "react-i18next";
import apiClient from "../../api/api"; // Import the api.js client
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const MarketStatus = () => {
  const { t } = useTranslation();
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarketStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token available");
        }

        const response = await apiClient.get("/tips/market-status");
        console.log("Market status response:", response.data);
        setMarketData(response.data.marketData || []);
      } catch (err) {
        console.error(
          "Failed to fetch market status:",
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
        setError(t("tipsPage.marketStatus.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchMarketStatus();
  }, [t, navigate]);

  return (
    <div className="market-status">
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
            {t("tipsPage.marketStatus.noVideoSupport")}
          </video>
        </div>
      )}

      {error && <div className="text-center text-danger">{error}</div>}

      {!loading && !error && (
        <>
          <h3 className="mb-4" style={{ color: "#28a745", fontWeight: "600" }}>
            {t("tipsPage.marketStatus.heading")}
          </h3>
          <p className="text-muted mb-4">
            {t("tipsPage.marketStatus.subtitle")}
          </p>

          {marketData.length > 0 ? (
            marketData.map((item, index) => (
              <div
                key={index}
                className="card mb-3 shadow-sm"
                style={{ borderLeft: "4px solid #28a745" }}
              >
                <div className="card-body">
                  <h5 className="card-title" style={{ color: "#28a745" }}>
                    {item.productName}
                  </h5>
                  <p className="card-text">
                    <strong>{t("tipsPage.marketStatus.price")}:</strong>{" "}
                    {item.price} / {item.unit}
                  </p>
                  <p className="card-text">
                    <strong>{t("tipsPage.marketStatus.updated")}:</strong>{" "}
                    {item.date}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">
                  {t("tipsPage.marketStatus.noDataTitle")}
                </h5>
                <p className="card-text">
                  {t("tipsPage.marketStatus.noDataSubtitle")}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarketStatus;
