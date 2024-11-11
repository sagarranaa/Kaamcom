import axios from "axios";

const API = axios.create({
  baseURL: "https://kaamcom.onrender.com/api", // Use the full backend URL or configure a proxy
});

// Add a request interceptor to attach the token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    console.log("Request headers:xxxxxxxxxxxxxxx", config.headers);
  }
  return config;
});

export default API;
