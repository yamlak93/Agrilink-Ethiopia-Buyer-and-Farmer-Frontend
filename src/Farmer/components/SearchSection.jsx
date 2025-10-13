import React from "react";
import { MdSearch, MdMyLocation } from "react-icons/md";

const SearchSection = ({ getWeatherDetails, searchValue, setSearchValue }) => {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const handleCitySearch = (e) => {
    e.preventDefault();
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchValue}&days=7`;
    getWeatherDetails(API_URL);
  };

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7`;
          getWeatherDetails(API_URL, true); // update input with location name
        },
        (error) => {
          console.error("Location access denied:", error);
          // Instead of alert, you can use a state to show a message in the UI
          alert("Location access denied. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    // The `search-section` class is from your WeatherForecast.css file
    <div className="search-section">
      {/* The `search-form` class is from your WeatherForecast.css file */}
      <form className="search-form" onSubmit={handleCitySearch}>
        <MdSearch size={22} color="#4caf50" />
        {/* The `search-input` class is from your WeatherForecast.css file */}
        <input
          type="search"
          placeholder="Enter a city name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          required
        />
      </form>
      {/* The `location-button` class is from your WeatherForecast.css file */}
      <button
        className="location-button"
        onClick={handleLocationSearch}
        aria-label="Get my location weather"
      >
        <MdMyLocation size={20} />
      </button>
    </div>
  );
};

export default SearchSection;
