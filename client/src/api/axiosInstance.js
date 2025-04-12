import axios from "axios";

// Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL; 

const headers = {
  "Content-Type": "application/json",
};

if (document.cookie) {
  headers["Authorization"] = document.cookie.split('; ')
  .find(row => row.startsWith('token='))
  ?.split('=')[1];
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: headers,
});

export default axiosInstance;
