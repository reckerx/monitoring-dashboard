// src/components/MetricChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const MetricChart = ({ title, dataPoints, label }) => {
  const labels = dataPoints.map((dp) =>
    new Date(dp.timestamp * 1000).toLocaleTimeString()
  );

  const data = {
    labels,
    datasets: [
      {
        label,
        data: dataPoints.map((dp) => dp.value),
        fill: false,
        tension: 0.3,
        borderColor: "#000000",          // <-- LINE COLOR (BLACK)
        backgroundColor: "#000000",      // <-- POINT FILL COLOR
        pointBorderColor: "#000000",     // <-- POINT BORDER COLOR
        pointBackgroundColor: "#000000", // <-- POINT FILL
        borderWidth: 2, 
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="metric-chart">
      <h3>{title}</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default MetricChart;
