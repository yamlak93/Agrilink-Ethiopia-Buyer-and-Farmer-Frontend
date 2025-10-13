import React from "react";
import { useTranslation } from "react-i18next";
import { weatherCodes } from "../../constants";

const DailyWeatherItem = ({ dailyWeather, onDayClick }) => {
  const { t, i18n } = useTranslation();

  const date = new Date(dailyWeather.date);
  // Day of the week translated
  const dayOfWeek = date.toLocaleDateString(i18n.language, {
    weekday: "short",
  });

  const maxTemp = Math.floor(dailyWeather.day.maxtemp_c);
  const minTemp = Math.floor(dailyWeather.day.mintemp_c);

  const weatherIcon = Object.keys(weatherCodes).find((icon) =>
    weatherCodes[icon].includes(dailyWeather.day.condition.code)
  );

  return (
    <li className="weather-item" onClick={() => onDayClick(dailyWeather.hour)}>
      <p className="day">{dayOfWeek}</p>
      <img
        src={`/icons/${weatherIcon}.svg`}
        alt={t("weather.iconAlt")}
        className="weather-icon"
      />
      <p className="temperature">
        {maxTemp}
        {t("weather.unit")} / {minTemp}
        {t("weather.unit")}
      </p>
    </li>
  );
};

export default DailyWeatherItem;
