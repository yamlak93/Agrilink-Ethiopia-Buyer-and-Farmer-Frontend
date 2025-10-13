import React from "react";
import { weatherCodes } from "../../constants";

const HourlyWeatherItem = ({ hourlyWeather }) => {
  const temperature = Math.floor(hourlyWeather.temp_c); // Temperature in Celsius
  const time = hourlyWeather.time.split(" ")[1].substring(0, 5); // Extracting time in HH:MM format
  const weatherIcon = Object.keys(weatherCodes).find((icon) =>
    weatherCodes[icon].includes(hourlyWeather.condition.code)
  );

  return (
    // The <li> has been replaced with a <div> to remove the bullet point
    <div className="flex flex-col items-center p-2">
      <p className="text-xs text-gray-500">{time}</p>
      <img
        src={`/icons/${weatherIcon}.svg`}
        alt="Weather icon"
        className="w-8 h-8 my-1"
      />
      <p className="text-sm font-semibold">{temperature} °C</p>
    </div>
  );
};

export default HourlyWeatherItem;
