// src/App.js
import React, { useEffect, useState } from "react";
import { fetchMetrics } from "./api";
import MetricCard from "./components/MetricCard";
import MetricChart from "./components/MetricChart";
import "./styles.css";

const POLL_INTERVAL_MS = 10000; // 10 seconds

function App() {
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      try {
        const data = await fetchMetrics();
        if (!isMounted) return;

        setLatestMetrics(data);

        setHistory((prev) => [
          ...prev.slice(-59),
          {
            timestamp: data.timestamp,
            cpu_usage: data.cpu_usage,
            memory_usage: data.memory_usage,
            request_latency_ms: data.request_latency_ms,
          },
        ]);
      } catch (err) {
        console.error("Error fetching metrics:", err);
      }
    };

    loadMetrics();
    const intervalId = setInterval(loadMetrics, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const cpuData = history.map((h) => ({
    timestamp: h.timestamp,
    value: h.cpu_usage,
  }));

  const memoryData = history.map((h) => ({
    timestamp: h.timestamp,
    value: h.memory_usage,
  }));

  const latencyData = history.map((h) => ({
    timestamp: h.timestamp,
    value: h.request_latency_ms,
  }));

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Monitoring Dashboard</h1>
        <p>Simple real-time view of backend metrics (polls every 10s)</p>
      </header>

      {!latestMetrics ? (
        <p className="loading-text">Loading metrics...</p>
      ) : (
        <>
          <section className="cards-grid">
            <MetricCard label="CPU Usage" value={latestMetrics.cpu_usage} unit="%" />
            <MetricCard label="Memory Usage" value={latestMetrics.memory_usage} unit="%" />
            <MetricCard
              label="Request Latency"
              value={latestMetrics.request_latency_ms}
              unit="ms"
            />
            <MetricCard
              label="Requests Served"
              value={latestMetrics.request_count}
            />
            <MetricCard
              label="Uptime"
              value={latestMetrics.uptime_seconds}
              unit="s"
            />
          </section>

          <section className="charts-grid">
            <MetricChart
              title="CPU Usage Over Time"
              dataPoints={cpuData}
              label="CPU %"
            />
            <MetricChart
              title="Memory Usage Over Time"
              dataPoints={memoryData}
              label="Memory %"
            />
            <MetricChart
              title="Request Latency Over Time"
              dataPoints={latencyData}
              label="Latency (ms)"
            />
          </section>
        </>
      )}
    </div>
  );
}

export default App;
