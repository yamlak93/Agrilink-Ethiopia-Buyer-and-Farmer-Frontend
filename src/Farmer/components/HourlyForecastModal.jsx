import React from "react";
import { useTranslation } from "react-i18next";
import HourlyWeatherItem from "./HourlyWeatherItem";
import "../../Css/HourlyForecastModal.css"; // Optional custom CSS file

const HourlyForecastModal = ({
  show,
  onHide,
  hourlyForecasts,
  selectedDate,
}) => {
  const { t, i18n } = useTranslation();

  if (!show) {
    return null;
  }

  const date = selectedDate
    ? new Date(selectedDate * 1000).toLocaleDateString(i18n.language, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div
      className="modal fade show hourly-modal-backdrop"
      style={{ display: "block" }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="hourlyForecastModalLabel"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content rounded-5 shadow-lg">
          {/* Modal Header */}
          <div
            className="modal-header border-0"
            style={{
              background: "linear-gradient(135deg, #28a745, #218838)",
              padding: "20px 30px",
            }}
          >
            <h5
              className="modal-title text-white"
              id="hourlyForecastModalLabel"
              style={{
                fontSize: "24px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              {t("weather.title")} - {date}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label={t("weather.close")}
              onClick={onHide}
            ></button>
          </div>

          {/* Modal Body */}
          <div
            className="modal-body p-4 overflow-y-auto"
            style={{
              maxHeight: "70vh",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <div className="d-flex flex-wrap justify-content-center gap-4 animate-fade-in">
              {hourlyForecasts.map((hourlyWeather) => (
                <div
                  key={hourlyWeather.time_epoch}
                  className="card text-center p-3 rounded-4 shadow-sm hourly-card"
                  style={{ width: "140px", transition: "transform 0.3s ease" }}
                >
                  <div
                    className="position-absolute top-0 start-50 translate-middle"
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#28a745",
                      boxShadow: "0 0 5px rgba(40, 167, 69, 0.5)",
                    }}
                  ></div>
                  <HourlyWeatherItem hourlyWeather={hourlyWeather} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyForecastModal;
