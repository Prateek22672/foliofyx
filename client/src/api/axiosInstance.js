/*// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"        // ✅ local backend for development
      : "https://foliofy-backend.onrender.com/api",  // ✅ live backend for production
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor to handle token refresh if JWT expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isJwtExpired = error.response?.data?.message === "jwt expired";

    if (isJwtExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token stored");

        // Use plain axios to avoid recursive interceptor triggering
        const res = await axios.post(
          "https://foliofy-backend.onrender.com/api/auth/refresh",
          { refreshToken }
        );

        const newToken = res.data.accessToken;
        localStorage.setItem("token", newToken);

        // Update axiosInstance headers and retry the original request
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // Clear tokens and redirect to login on failure
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response OR already retried → just reject
    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = error.response.data?.message || "";

    const isExpired =
      status === 401 &&
      (message.includes("jwt expired") ||
        message.includes("invalid token") ||
        message.includes("Unauthorized"));

    if (!isExpired) return Promise.reject(error);

    // Mark retry
    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token stored");

      console.log("🔄 Refreshing access token...");

      const res = await axios.post(
        "https://foliofy-backend.onrender.com/api/auth/refresh",
        { refreshToken }
      );

      const newToken = res.data.accessToken;
      localStorage.setItem("token", newToken);

      // update headers
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newToken}`;
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

      console.log("✅ Token refreshed. Retrying request...");
      return axiosInstance(originalRequest);
    } catch (err) {
      console.log("❌ Refresh token invalid. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);



*/
// src/api/axiosInstance.js
import axios from "axios";

/* ============================
   ✅ BASE URL
============================ */
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://foliofyx-backend.onrender.com/api"; // ⚠️ make sure this matches your Render URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   ✅ REQUEST INTERCEPTOR
============================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   ✅ RESPONSE INTERCEPTOR
============================ */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const reqUrl = error.config?.url || "";

    // A 401 from the login/signup endpoints just means wrong credentials —
    // hard-reloading to /login here used to replay the whole splash screen
    // on every failed login attempt. Only force-redirect when an
    // authenticated session actually expires elsewhere in the app.
    const isAuthCall = /\/auth\/(login|google-login|signup|register|refresh)/.test(reqUrl);
    const onAuthPage = ["/login", "/signup"].includes(window.location.pathname);

    if (status === 401 && !isAuthCall && !onAuthPage) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }

    console.error("API Error:", error.response?.data || error.message);

    return Promise.reject(error);
  }
);

export default axiosInstance;