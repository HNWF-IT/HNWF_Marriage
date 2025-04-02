import axios from "axios";

// Base URL
const API_BASE_URL = "http://localhost:8000/api"; 

const headers = {
  "Content-Type": "application/json",
};

if (document.cookie) {
  headers["Authorization"] = document.cookie
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: headers,
});

export default axiosInstance;
