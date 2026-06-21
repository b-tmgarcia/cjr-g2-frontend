import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const publicRoutes = ["/login", "/forgot-password"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPublicRoute = publicRoutes.some((route) => error.config?.url?.includes(route));

    if (error.response?.status === 401 && !isPublicRoute && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
