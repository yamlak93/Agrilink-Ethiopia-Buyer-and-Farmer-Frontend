import React, { useState, useEffect } from "react";
import "../../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WeatherForecast from "../components/WeatherForecast";
import SeasonalCalendar from "../components/SeasonalCalendar";
import FarmingTipsContent from "../components/FarmingTipsContent";
import AlertsContent from "../components/AlertsContent";
import ResourcesContent from "../components/ResourcesContent";
import MarketStatus from "../components/MarketStatus";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Tips = () => {
  const [activeTab, setActiveTab] = useState("farmingTips");
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        // Example API call (uncomment and adjust endpoint if needed)
        // const response = await apiClient.get("/tips/data");
        // Use response.data as needed (e.g., pass to child components)
      } catch (err) {
        console.error(
          "Failed to fetch tips data:",
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
        navigate("/error", { state: { error: err.message }, replace: true });
      }
    };

    fetchData();
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "alerts":
        return <AlertsContent />;
      case "resources":
        return <ResourcesContent />;
      case "marketStatus":
        return <MarketStatus />;
      case "farmingTips":
      default:
        return <FarmingTipsContent />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <header className="mb-4">
            <h2>{t("tipsPage.heading")}</h2>
            <p className="text-muted">{t("tipsPage.subtitle")}</p>
          </header>

          <div className="row">
            <div className="col-lg-8">
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "farmingTips" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("farmingTips")}
                  >
                    {t("tipsPage.tabs.farmingTips")}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "alerts" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("alerts")}
                  >
                    {t("tipsPage.tabs.alerts")}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "resources" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("resources")}
                  >
                    {t("tipsPage.tabs.resources")}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "marketStatus" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("marketStatus")}
                  >
                    {t("tipsPage.tabs.marketStatus")}
                  </button>
                </li>
              </ul>

              <div>{renderContent()}</div>
            </div>

            <div className="col-lg-4">
              <WeatherForecast />
              <SeasonalCalendar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tips;
