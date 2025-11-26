import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import MainDetails from "./components/MainDetails";
import ForecastChart from "./components/ForecastChart";

const DEFAULT_CITY = "Jakarta";

const transformForecastData = (weatherData) => {
  if (!weatherData || !weatherData.hourly) return [];

  const hourlyData = weatherData.hourly;
  const numDays = 7;
  const dailyForecasts = [];

  for (let d = 0; d < numDays; d++) {
    const startIndex = d * 24;
    const endIndex = startIndex + 24;

    const dayTemperatures = hourlyData.temperature_2m.slice(
      startIndex,
      endIndex
    );

    if (dayTemperatures.length > 0) {
      const maxTemp = Math.max(...dayTemperatures);
      const date = new Date(hourlyData.time[startIndex]);
      const dayLabel = date.toLocaleDateString("id-ID", { weekday: "short" });

      dailyForecasts.push({
        name: dayLabel,
        tempMax: Math.round(maxTemp),
      });
    }
  }
  return dailyForecasts;
};

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState(DEFAULT_CITY);
  const [inputCity, setInputCity] = useState(DEFAULT_CITY);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (!searchCity) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchCity
        )}&format=json&limit=1`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoResponse.ok || geoData.length === 0) {
          throw new Error(`Kota "${searchCity}" tidak ditemukan.`);
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;
        const displayName = geoData[0].display_name.split(",")[0];
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation&daily=uv_index_max&current_weather=true&timezone=auto&forecast_days=7`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
          throw new Error("Gagal mengambil data cuaca Open-Meteo.");
        }

        const data = await weatherResponse.json();

        setWeatherData({
          ...data,
          city_name: displayName,
        });
      } catch (err) {
        console.error("Fetch Error: ", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [searchCity]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchCity(inputCity);
    }
  };

  if (loading) {
    return (
      <div className="weather-container">
        Memuat data cuaca untuk {searchCity}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-container error" style={{ textAlign: "center" }}>
        <h2>🚨 Gagal Memuat Data</h2>
        <p>{error}</p>
        <button
          onClick={() => setSearchCity(DEFAULT_CITY)}
          style={{
            padding: "10px 20px",
            backgroundColor: "var(--color-neon-purple)",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Coba Cari {DEFAULT_CITY}
        </button>
      </div>
    );
  }

  if (!weatherData || !weatherData.current_weather) return null;

  const temp = Math.round(weatherData.current_weather.temperature);
  const windSpeed = weatherData.current_weather.windspeed;
  const city = weatherData.city_name;
  const time = weatherData.current_weather.time.substring(11, 16);
  const currentHour = new Date().getHours();
  const humidity = weatherData.hourly.relative_humidity_2m[currentHour];
  const maxUVIndex = weatherData.daily.uv_index_max[0];
  const precipitation = weatherData.hourly.precipitation[currentHour];
  const forecastData = transformForecastData(weatherData);

  return (
    <>
      <div className="weather-container">
        <div
          style={{
            gridColumn: "1 / 3",
            textAlign: "right",
            marginBottom: "10px",
          }}
        >
          <button
            onClick={toggleTheme}
            style={{
              padding: "8px 15px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: isDarkMode
                ? "var(--color-neon-purple)"
                : "var(--color-accent-blue)",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>

        <SearchBar
          inputCity={inputCity}
          setInputCity={setInputCity}
          handleSearch={handleSearch}
        />

        <div className="divider"></div>

        <MainDetails
          temp={temp}
          city={city}
          windSpeed={windSpeed}
          humidity={humidity}
          time={time}
          maxUVIndex={maxUVIndex}
          precipitation={precipitation}
        />

        <ForecastChart data={forecastData} />
      </div>

      <footer className="app-footer">
        Dibuat oleh audyrev | Sumber Data: Open-Meteo & Nominatim
      </footer>
    </>
  );
};

export default App;
