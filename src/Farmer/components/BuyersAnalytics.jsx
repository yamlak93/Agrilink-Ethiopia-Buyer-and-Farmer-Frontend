import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import Loader from "../../assets/Agriculture Loader.webm";
import { useTranslation } from "react-i18next";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BuyersAnalytics = () => {
  const { t } = useTranslation();

  const [buyersData, setBuyersData] = useState({
    labels: [t("analytics.buyersAnalytics.noData")],
    datasets: [
      {
        label: t("analytics.buyersAnalytics.chartLabel"),
        data: [0],
        backgroundColor: "rgba(53, 162, 235, 0.8)",
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuyersAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");

        const response = await axios.get(
          "http://localhost:5000/api/analytics",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { buyersAnalytics } = response.data;

        if (buyersAnalytics && buyersAnalytics.labels && buyersAnalytics.data) {
          setBuyersData({
            labels: buyersAnalytics.labels,
            datasets: [
              {
                label: t("analytics.buyersAnalytics.chartLabel"),
                data: buyersAnalytics.data,
                backgroundColor: "rgba(53, 162, 235, 0.8)",
              },
            ],
          });
        } else {
          setBuyersData({
            labels: [t("analytics.buyersAnalytics.noData")],
            datasets: [
              {
                label: t("analytics.buyersAnalytics.chartLabel"),
                data: [0],
                backgroundColor: "rgba(53, 162, 235, 0.8)",
              },
            ],
          });
        }
      } catch (err) {
        console.error(
          "Failed to fetch buyers analytics:",
          err.response?.data || err.message
        );
        setError(t("analytics.buyersAnalytics.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchBuyersAnalytics();
  }, [t]);

  const buyersOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: t("analytics.buyersAnalytics.chartTitle"),
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <>
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
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      {error && <div className="text-center text-danger">{error}</div>}
      {!loading && !error && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              {t("analytics.buyersAnalytics.title")}
            </h5>
            <p className="card-text">
              {t("analytics.buyersAnalytics.subtitle")}
            </p>
            <Bar data={buyersData} options={buyersOptions} />
          </div>
        </div>
      )}
    </>
  );
};

export default BuyersAnalytics;
