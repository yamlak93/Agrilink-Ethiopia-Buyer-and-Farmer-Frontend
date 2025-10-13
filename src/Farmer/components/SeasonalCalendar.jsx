import React from "react";
import { useTranslation } from "react-i18next";

const SeasonalCalendar = () => {
  const { t } = useTranslation();

  return (
    <div
      className="card mb-4"
      style={{
        border: "none",
        background: "linear-gradient(135deg, #ffffff, #f8faf8)",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
      }}
    >
      <div className="card-body p-4">
        <h5
          className="card-title mb-2"
          style={{
            color: "#28a745",
            fontSize: "20px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1px",
            background: "linear-gradient(90deg, #28a745, #218838)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("tipsPage.seasonalCalendar.title")}
        </h5>
        <p
          className="card-subtitle text-muted mb-3"
          style={{ fontSize: "14px", opacity: 0.8 }}
        >
          {t("tipsPage.seasonalCalendar.subtitle")}
        </p>

        <ul
          className="list-group list-group-flush"
          style={{ borderRadius: "8px", overflow: "hidden" }}
        >
          {/* Planting Season */}
          <li
            className="list-group-item d-flex align-items-center p-3"
            style={{
              background: "#ffffff",
              borderLeft: "4px solid #28a745",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f4f8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
          >
            <span className="fs-4 me-3" style={{ color: "#28a745" }}>
              🌱
            </span>
            <div>
              <strong
                style={{
                  color: "#28a745",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {t("tipsPage.seasonalCalendar.planting")}
              </strong>
              <p
                className="mb-0 text-muted"
                style={{ fontSize: "14px", opacity: 0.7 }}
              >
                {t("months.jun")} - {t("months.jul")}
              </p>
            </div>
          </li>

          {/* Rainy Season */}
          <li
            className="list-group-item d-flex align-items-center p-3"
            style={{
              background: "#ffffff",
              borderLeft: "4px solid #28a745",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f4f8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
          >
            <span className="fs-4 me-3" style={{ color: "#28a745" }}>
              🌧️
            </span>
            <div>
              <strong
                style={{
                  color: "#28a745",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {t("tipsPage.seasonalCalendar.rainy")}
              </strong>
              <p
                className="mb-0 text-muted"
                style={{ fontSize: "14px", opacity: 0.7 }}
              >
                {t("months.jun")} - {t("months.sep")}
              </p>
            </div>
          </li>

          {/* Harvest Season */}
          <li
            className="list-group-item d-flex align-items-center p-3"
            style={{
              background: "#ffffff",
              borderLeft: "4px solid #28a745",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f4f8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
          >
            <span className="fs-4 me-3" style={{ color: "#28a745" }}>
              🌾
            </span>
            <div>
              <strong
                style={{
                  color: "#28a745",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {t("tipsPage.seasonalCalendar.harvest")}
              </strong>
              <p
                className="mb-0 text-muted"
                style={{ fontSize: "14px", opacity: 0.7 }}
              >
                {t("months.oct")} - {t("months.dec")}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SeasonalCalendar;
