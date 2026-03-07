import axios from "axios";
import { API_URL } from "../config/api";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {

      if (error.response.status === 401) {
        console.log("Unauthorized");
      }

      if (error.response.status === 500) {
        console.log("Server error");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;