import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CurrentWeather from "./CurrentWeather";
import SearchSection from "./SearchSection";
import NoResultsDiv from "./NoResultsDiv";
import DailyWeatherItem from "./DailyWeatherItem";
import HourlyForecastModal from "./HourlyForecastModal";
import { weatherCodes } from "../../constants";
import "../../Css/Weather.css";

const WeatherForecast = () => {
  const { t } = useTranslation(); // i18n hook

  const [currentWeather, setCurrentWeather] = useState({});
  const [dailyForecasts, setDailyForecasts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [hasNoResults, setHasNoResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDayHourlyForecast, setSelectedDayHourlyForecast] = useState(
    []
  );

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeatherDetails = async (API_URL, updateInput = false) => {
    setHasNoResults(false);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(t("weather.fetchError"));

      const data = await response.json();
      const temperature = Math.floor(data.current.temp_c);
      const description = data.current.condition.text;
      const weatherIcon = Object.keys(weatherCodes).find((icon) =>
        weatherCodes[icon].includes(data.current.condition.code)
      );

      setCurrentWeather({ temperature, description, weatherIcon });
      setDailyForecasts(data.forecast.forecastday);

      if (updateInput) setSearchValue(data.location.name);
    } catch (error) {
      console.error(t("weather.fetchError"), error);
      setHasNoResults(true);
    }
  };

  const handleDayClick = (hourlyData) => {
    setSelectedDayHourlyForecast(hourlyData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDayHourlyForecast([]);
  };

  useEffect(() => {
    const defaultCity = "Addis Ababa";
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${defaultCity}&days=7`;
    getWeatherDetails(API_URL, true);
  }, []);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">{t("weather.title")}</h5>

        <SearchSection
          getWeatherDetails={getWeatherDetails}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

        {hasNoResults ? (
          <NoResultsDiv text={t("weather.noResults")} />
        ) : (
          <>
            <CurrentWeather currentWeather={currentWeather} />
            <hr />
            <ul className="weather-list list-unstyled">
              {dailyForecasts.map((dailyWeather) => (
                <DailyWeatherItem
                  key={dailyWeather.date_epoch}
                  dailyWeather={dailyWeather}
                  onDayClick={handleDayClick}
                />
              ))}
            </ul>
          </>
        )}

        <HourlyForecastModal
          show={showModal}
          onHide={handleCloseModal}
          hourlyForecasts={selectedDayHourlyForecast}
          selectedDate={selectedDayHourlyForecast[0]?.time_epoch}
        />
      </div>
    </div>
  );
};

export default WeatherForecast;
