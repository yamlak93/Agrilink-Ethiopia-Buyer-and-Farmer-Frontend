import React, { useState, useEffect } from "react";
import TipCard from "./TipCard";
import Loader from "../../assets/Agriculture Loader.webm";
import { useTranslation } from "react-i18next";
import apiClient from "../../api/api"; // Import the api.js client
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const FarmingTipsContent = () => {
  const { t } = useTranslation();
  const [tipsData, setTipsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmingTips = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");

        const response = await apiClient.get("/tips/farming-tips");
        setTipsData(response.data.tips || []);
      } catch (err) {
        console.error("Failed to fetch farming tips:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", {
            replace: true,
            state: { message: "Session expired. Please log in again." },
          });
          return;
        }
        setError(t("tipsPage.farmingTips.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchFarmingTips();
  }, [t, navigate]);

  return (
    <div>
      {loading && (
        <div
          className="text-center"
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
            style={{ width: "300px", height: "300px", margin: "0 auto" }}
          >
            <source src={Loader} type="video/webm" />
            {t("common.loading")}
          </video>
        </div>
      )}

      {error && <div className="text-center text-danger">{error}</div>}

      {!loading && !error && (
        <>
          {tipsData.length > 0 ? (
            tipsData.map((tip) => (
              <TipCard
                key={tip.tipId}
                title={tip.title}
                category={tip.category}
                date={tip.date}
                content={tip.content}
              />
            ))
          ) : (
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">
                  {t("tipsPage.farmingTips.noTipsTitle")}
                </h5>
                <p className="card-text">
                  {t("tipsPage.farmingTips.noTipsSubtitle")}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FarmingTipsContent;
