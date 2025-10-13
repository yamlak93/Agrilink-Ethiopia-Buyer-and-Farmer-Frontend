import React, { useState, useEffect } from "react";
import SummaryCard from "./SummaryCard";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesAnalytics = () => {
  const { t } = useTranslation();

  // Initial state: empty arrays for labels, zeros for numbers
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: `0.00 ${t("payments.etb")}`,
    productsSold: `0.00 ${t("units.kilogram (kg)")}`,
    averageOrderValue: `0.00 ${t("payments.etb")}`,
    repeatBuyersPercentage: "0.00%",
    salesData: {
      labels: [], // will be translated later
      datasets: [
        {
          label: "",
          data: [],
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: get translated month names
  const getMonthLabels = () => [
    t("months.jan"),
    t("months.feb"),
    t("months.mar"),
    t("months.apr"),
    t("months.may"),
    t("months.jun"),
    t("months.jul"),
    t("months.aug"),
    t("months.sep"),
    t("months.oct"),
    t("months.nov"),
    t("months.dec"),
  ];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
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

        const { salesAnalytics } = response.data;

        setAnalyticsData({
          totalRevenue: `${Number(salesAnalytics.totalRevenue || 0).toFixed(
            2
          )} ${t("payments.etb")}`,
          productsSold: `${Number(salesAnalytics.productsSold || 0).toFixed(
            2
          )} ${t("units.kilogram (kg)")}`,
          averageOrderValue: `${Number(
            salesAnalytics.averageOrderValue || 0
          ).toFixed(2)} ${t("payments.etb")}`,
          repeatBuyersPercentage: `${Number(
            salesAnalytics.repeatBuyersPercentage || 0
          ).toFixed(2)}%`,
          salesData: {
            labels: salesAnalytics.salesData?.labels?.length
              ? salesAnalytics.salesData.labels.map(
                  (m, i) => getMonthLabels()[i] || m
                )
              : getMonthLabels(),
            datasets: [
              {
                label: `${t("analytics.salesChart.totalSales")} (${t(
                  "payments.etb"
                )})`,
                data:
                  salesAnalytics.salesData?.datasets?.[0]?.data ||
                  Array(12).fill(0),
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
        });
      } catch (err) {
        console.error(
          "Failed to fetch analytics:",
          err.response?.data || err.message
        );
        setError(t("analytics.salesChart.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [t]);

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: t("analytics.salesChart.heading") },
    },
    scales: { y: { beginAtZero: true } },
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
        <>
          <div className="row my-4">
            <SummaryCard
              title={t("dashboard.revenue")}
              value={analyticsData.totalRevenue}
              icon="📈"
            />
            <SummaryCard
              title={t("analytics.productSold")}
              value={analyticsData.productsSold}
              icon="📦"
            />
            <SummaryCard
              title={t("analytics.avgorderValue")}
              value={analyticsData.averageOrderValue}
              icon="🛒"
            />
            <SummaryCard
              title={t("analytics.repeatBuyers")}
              value={analyticsData.repeatBuyersPercentage}
              icon="🧑‍🤝‍🧑"
            />
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{t("analytics.salesChart.title")}</h5>
              <p className="card-text">{t("analytics.salesChart.subtitle")}</p>
              <Line data={analyticsData.salesData} options={salesOptions} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SalesAnalytics;
