import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import Loader from "../../assets/Agriculture Loader.webm";
import { useTranslation } from "react-i18next";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ProductAnalytics = () => {
  const { t } = useTranslation();

  const [productData, setProductData] = useState({
    labels: [t("analytics.productAnalytics.noData")],
    datasets: [
      {
        label: t("analytics.productAnalytics.chartLabel"),
        data: [0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductAnalytics = async () => {
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

        const { productAnalytics } = response.data;

        setProductData({
          labels: productAnalytics.labels?.length
            ? productAnalytics.labels
            : [t("analytics.productAnalytics.noData")],
          datasets: [
            {
              label: t("analytics.productAnalytics.chartLabel"),
              data: productAnalytics.data?.length ? productAnalytics.data : [0],
              backgroundColor: [
                "rgba(255, 99, 132, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(153, 102, 255, 0.8)",
                "rgba(255, 159, 64, 0.8)",
              ].slice(0, productAnalytics.labels?.length || 1),
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ].slice(0, productAnalytics.labels?.length || 1),
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error(
          "Failed to fetch product analytics:",
          err.response?.data || err.message
        );
        setError(t("analytics.productAnalytics.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchProductAnalytics();
  }, [t]);

  const productOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
      title: {
        display: true,
        text: t("analytics.productAnalytics.chartTitle"),
      },
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
              {t("analytics.productAnalytics.title")}
            </h5>
            <p className="card-text">
              {t("analytics.productAnalytics.subtitle")}
            </p>
            <div
              style={{
                maxWidth: "400px",
                maxHeight: "400px",
                margin: "0 auto",
              }}
            >
              <Doughnut data={productData} options={productOptions} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductAnalytics;
