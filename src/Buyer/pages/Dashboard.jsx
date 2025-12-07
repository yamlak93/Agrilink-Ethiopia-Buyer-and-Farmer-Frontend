// src/pages/BuyerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import OrdersSection from "../components/OrderSection";
import ProductsSection from "../components/ProductSection";
import "../../Css/Devices.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faClock,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Loader from "../../assets/Agriculture Loader.mp4";
import { useTranslation } from "react-i18next"; // <-- ADD THIS

const API_BASE = "http://localhost:5000/api";

const BuyerDashboard = () => {
  const { t } = useTranslation(); // <-- ADD THIS
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const userData = localStorage.getItem("user");
      if (!userData) {
        navigate("/login", { replace: true });
        return;
      }

      let user;
      try {
        user = JSON.parse(userData);
      } catch (e) {
        navigate("/login", { replace: true });
        return;
      }

      if (user.role !== "Buyer") {
        navigate("/login", { replace: true });
        return;
      }

      setUserName(user.name || "User");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          fetch(`${API_BASE}/buyer/stats`, { headers }),
          fetch(`${API_BASE}/buyer/orders/recent`, { headers }),
          fetch(`${API_BASE}/buyer/products/recommended`, { headers }),
        ]);

        if (!statsRes.ok || !ordersRes.ok || !productsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [statsData, ordersData, productsData] = await Promise.all([
          statsRes.json(),
          ordersRes.json(),
          productsRes.json(),
        ]);

        setStats(statsData);
        setRecentOrders(ordersData);
        setRecommendedProducts(productsData.slice(0, 3));
      } catch (err) {
        console.error("API Error:", err);
        if (err.message.includes("401")) {
          localStorage.clear();
          navigate("/login");
        } else {
          navigate("/error", {
            state: { error: { message: "Network error" } },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, t]); // <-- ADD t to deps

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold">
                {t("buyerDashboard.welcome")}, {userName}!
              </h2>
              <p className="text-muted">{t("buyerDashboard.overview")}</p>
            </div>
            <Link to="/products">
              <button className="btn btn-success">
                {t("buyerDashboard.browseProducts")}
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <video
                autoPlay
                loop
                muted
                style={{ width: "300px", height: "300px" }}
              >
                <source src={Loader} type="video/mp4" />
                {t("common.loading")}...
              </video>
            </div>
          ) : (
            <>
              <div className="row mb-4">
                <div className="col-md-4">
                  <StatCard
                    title={t("buyerDashboard.totalOrders")}
                    value={stats.totalOrders}
                    icon={faShoppingCart}
                    iconBgClass="bg-success"
                  />
                </div>
                <div className="col-md-4">
                  <StatCard
                    title={t("buyerDashboard.pendingDeliveries")}
                    value={stats.pendingDeliveries}
                    description={t("buyerDashboard.pendingDesc")}
                    icon={faClock}
                    iconBgClass="bg-warning"
                  />
                </div>
                <div className="col-md-4">
                  <StatCard
                    title={t("buyerDashboard.completedDeliveries")}
                    value={stats.completedDeliveries}
                    icon={faCheckCircle}
                    iconBgClass="bg-primary"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <OrdersSection orders={recentOrders} />
                </div>
                <div className="col-md-6 mb-4">
                  <ProductsSection products={recommendedProducts} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BuyerDashboard;
