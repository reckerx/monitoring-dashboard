const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
const startTime = Date.now();
let requestCount = 0;
function getMetrics() {
 requestCount += 1;
 const now = Date.now();
 const uptimeSeconds = Math.floor((now - startTime) / 1000);
 const randomInRange = (min, max, decimals = 2) => {
 const num = Math.random() * (max - min) + min;
 return Number(num.toFixed(decimals));
 };
 return {
 cpu_usage: randomInRange(10, 90),
 memory_usage: randomInRange(20, 95),
 request_latency_ms: randomInRange(10, 250),
 uptime_seconds: uptimeSeconds,
 request_count: requestCount,
 timestamp: Date.now() / 1000
 };
}
app.get("/metrics", (req, res) => {
 res.json(getMetrics());
});
app.get("/health", (req, res) => {
 res.json({ status: "ok", timestamp: Date.now() });
});
app.listen(PORT, () => {
 console.log(`Monitoring backend (Node.js) running on port ${PORT}`);
});