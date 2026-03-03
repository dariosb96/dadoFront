// src/Redux/api.js
import axios from "axios";
import store from "./store";
import { LOGOUT } from "./actions/Auth/login";

const URL_DEPLOY = import.meta.env.VITE_URL2;

export const api = axios.create({
  baseURL: URL_DEPLOY,
  withCredentials: false,
});

/* ===========================
   REQUEST INTERCEPTOR
=========================== */

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ===========================
   RESPONSE INTERCEPTOR
=========================== */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      // Solo cerrar sesión si había token (token expirado)
      if (token) {
        store.dispatch({ type: LOGOUT });
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
      }
    }

    return Promise.reject(error);
  }
);