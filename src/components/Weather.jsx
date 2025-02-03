import { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import humidity_icon from "../assets/humidity.png";
import wind_icon from "../assets/wind.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";


// Weather icons mapping function
const allIcons = {
  "01d": clear_icon,
  "01n": clear_icon,
  "02d": cloud_icon,
  "02n": cloud_icon,
  "03d": cloud_icon,
  "03n": cloud_icon,
  "04d": drizzle_icon,
  "04n": drizzle_icon,
  "09d": rain_icon,
  "09n": rain_icon,
  "10d": rain_icon,
  "10n": rain_icon,
  "13d": snow_icon,
  "13n": snow_icon,
};

const getWeatherIcon = (iconCode) => allIcons[iconCode] || clear_icon;

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (city) => {
    if (!city) {
      alert("Please enter a city name");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setWeatherData(null);
        return;
      }

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.round(data.main.temp),
        location: data.name,
        icon: getWeatherIcon(data.weather[0].icon),
      });
    } catch (error) {
      alert("Error fetching weather data. Please try again.");
      console.log({error});
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("London");
  }, []);

  return (
    <div className="weather-container">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search for a city..." />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => fetchWeather(inputRef.current.value)}
        />
      </div>

      {loading ? (
        <p className="loading-text">Fetching weather data...</p>
      ) : (
        weatherData && (
          <div className="weather-card">
            <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
            <p className="temperature">{weatherData.temperature}°C</p>
            <p className="location">{weatherData.location}</p>

            <div className="weather-details">
              <div className="detail">
                <img src={humidity_icon} alt="Humidity" />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>

              <div className="detail">
                <img src={wind_icon} alt="Wind Speed" />
                <div>
                  <p>{weatherData.windSpeed} km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Weather;
