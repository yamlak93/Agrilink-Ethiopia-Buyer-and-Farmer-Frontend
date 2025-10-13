import React from "react";
import { useTranslation } from "react-i18next";

const CurrentWeather = ({ currentWeather }) => {
  const { t } = useTranslation();

  return (
    <div className="current-weather text-center">
      <img
        src={`/icons/${currentWeather.weatherIcon}.svg`}
        alt={t("weather.iconAlt")}
        className="weather-icon"
      />
      <h2 className="temperature">
        {currentWeather.temperature} <span>{t("weather.unit")}</span>
      </h2>
      <p className="description">{currentWeather.description}</p>
    </div>
  );
};

export default CurrentWeather;
