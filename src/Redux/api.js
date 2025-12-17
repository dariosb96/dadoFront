// src/Redux/api.js
import axios from "axios";
const URL_LOCAL = import.meta.env.VITE_URL1;
const URL_DEPLOY = import.meta.env.VITE_URL2;
import { LOGOUT } from "./actions/Auth/login";
import store from "./store"

export const api = axios.create({
  baseURL: URL_DEPLOY,
});


api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      store.dispatch({ type: LOGOUT });


      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);
