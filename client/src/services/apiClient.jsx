// src/services/apiClient.jsx

import axios from "axios";

// Create an Axios instance with the base URL from environment variables
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL, // Ensure this is correctly set in your environment variables
});

// Define a list of endpoints that should not include the Authorization header
const authEndpoints = ["/auth/login", "/auth/register", "/auth/refresh-token"];

// Add a request interceptor to include the token in all requests except auth-related ones
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the 'userInfo' object from localStorage
    const userInfoStr = localStorage.getItem("userInfo");
    let token = null;

    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        token = userInfo.token; // Adjust if your token is nested differently
      } catch (error) {
        console.error("Error parsing userInfo from localStorage:", error);
      }
    }

    // Check if the request URL is not in the authEndpoints list
    const isAuthRequest = authEndpoints.some((endpoint) =>
      config.url.startsWith(endpoint)
    );

    // If it's not an auth-related request and a token exists, set the Authorization header
    if (!isAuthRequest && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 Unauthorized errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Redirecting to login.");

      // Clear user information from localStorage
      localStorage.removeItem("userInfo");

      // Optionally, dispatch a logout action here if using Redux
      // For example:
      // store.dispatch(logout());

      // Redirect to the login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
