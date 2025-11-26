import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ForecastChart = ({ data }) => {
  return (
    <div className="forecast-chart-container" style={{ gridColumn: "1 / 3" }}>
      <h3 style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
        Prakiraan Suhu 7 Hari
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <filter id="neonGlow">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="3"
                floodColor="var(--color-neon-blue)"
                floodOpacity="0.8"
              />
            </filter>
          </defs>

          <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
          <YAxis stroke="var(--color-text-secondary)" />

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card-bg)",
              border: "none",
            }}
            formatter={(value) => [`${value}°C`, "Max Temp"]}
          />

          <Line
            type="monotone"
            dataKey="tempMax"
            stroke="var(--color-neon-blue)"
            strokeWidth={3}
            filter="url(#neonGlow)"
            dot={{
              fill: "var(--color-neon-blue)",
              r: 4,
              stroke: "var(--color-card-bg)",
              strokeWidth: 2,
            }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
