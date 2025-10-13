import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/Devices.css"; // Link to Devices.css
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import SalesAnalytics from "../components/SalesAnalytics"; // New component for sales content
import ProductAnalytics from "../components/ProductAnalytics"; // New component for product content
import BuyersAnalytics from "../components/BuyersAnalytics"; // New component for buyers content
import Loader from "../../assets/Agriculture Loader.webm";
import { useTranslation } from "react-i18next"; // ✅ i18n hook

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const navigate = this.props.navigate;
    navigate("/error", { state: { error: error.message }, replace: true });
  }

  render() {
    if (this.state.hasError) {
      return null; // Component will redirect in componentDidCatch
    }
    return this.props.children;
  }
}

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sales"); // State to track the active tab
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors
  const { t } = useTranslation();
  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        // Simulate API call (replace with actual endpoint if needed)
        // For now, relying on child components to fetch their data
        // const response = await axios.get("http://localhost:5000/api/analytics", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // const data = response.data;
      } catch (err) {
        console.error(
          "Failed to fetch analytics:",
          err.response?.data || err.message
        );
        setError("Failed to load analytics data. Redirecting to error page.");
        navigate("/error", { state: { error: err.message }, replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [navigate]);

  // Simulate loading completion (can be removed if API call is implemented)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate 1-second load time
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "sales":
        return <SalesAnalytics />;
      case "products":
        return <ProductAnalytics />;
      case "buyers":
        return <BuyersAnalytics />;
      default:
        return <SalesAnalytics />;
    }
  };

  return (
    <ErrorBoundary navigate={navigate}>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <header className="mb-4">
            <h2>{t("analytics.title")}</h2>
            <p className="text-muted">{t("analytics.subtitle")}</p>
          </header>
          {/* Tab navigation for Sales, Products, and Buyers */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "sales" ? "active" : ""}`}
                onClick={() => setActiveTab("sales")}
              >
                {t("analytics.tabs.sales")}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "products" ? "active" : ""
                }`}
                onClick={() => setActiveTab("products")}
              >
                {t("analytics.tabs.products")}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "buyers" ? "active" : ""}`}
                onClick={() => setActiveTab("buyers")}
              >
                {t("analytics.tabs.buyers")}
              </button>
            </li>
          </ul>

          {loading ? (
            <div
              className="text-center"
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                minHeight: "400px", // Ensure it takes up space
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
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AnalyticsDashboard;
