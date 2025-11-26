import React from "react";

const MainDetails = ({
  temp,
  city,
  windSpeed,
  humidity,
  time,
  maxUVIndex,
  precipitation,
}) => {
  const neonValue = (value) => (
    <span
      style={{
        color: "var(--color-text-primary)",
        fontWeight: "bold",
        textShadow: "0 0 3px rgba(255, 255, 255, 0.5)",
      }}
    >
      {value}
    </span>
  );

  return (
    <>
      <div className="main-display">
        <h1 className="temperature">{temp}°C</h1>
        <p className="city-name">{city}</p>
        <p className="description">Waktu Saat Ini ({time})</p>
      </div>

      <div className="details-panel">
        <h3>Detail Hari Ini</h3>
        <p>🌬️ Angin: {neonValue(`${windSpeed} km/h`)}</p>
        <p>💧 Kelembaban: {neonValue(`${humidity}%`)}</p>
        <p>☀️ UV Index Maks: {neonValue(maxUVIndex)}</p>
        <p>🌧️ Curah Hujan (Saat Ini): {neonValue(`${precipitation} mm`)}</p>
      </div>
    </>
  );
};

export default MainDetails;
