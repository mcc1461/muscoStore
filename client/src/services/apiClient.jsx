// apiClient.jsx

import axios from "axios";

// Set the base URL using the environment variable
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

export default apiClient;
