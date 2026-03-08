import axios from "axios";
import { API_URL } from "../config/api";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


axiosClient.interceptors.response.use(
  (response) => response.data.data,
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