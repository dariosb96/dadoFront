// src/Redux/api.js
import axios from "axios";
const URL_LOCAL = import.meta.env.VITE_URL2;

export const api = axios.create({
  baseURL: URL_LOCAL,
});


api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
