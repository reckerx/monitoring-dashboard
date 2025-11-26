// src/api.js
import axios from "axios";
const API_BASE_URL =
  (window.RUNTIME_CONFIG && window.RUNTIME_CONFIG.REACT_APP_API_BASE_URL) ||
  "http://localhost:30080";
// const API_BASE_URL = "http://localhost:30080";
// const API_BASE_URL = window.RUNTIME_CONFIG.REACT_APP_API_BASE_URL
export const fetchMetrics = async () => {
  const response = await axios.get(`${API_BASE_URL}/metrics`);
  return response.data;
};
