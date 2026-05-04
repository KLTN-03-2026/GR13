import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8088/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    // Try both "token" (legacy/admin) and "bc_token" (AuthContext)
    const token = localStorage.getItem("token") || localStorage.getItem("bc_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper for files using apiFetch as default export (backward compatibility)
const apiFetch = async (url: string, options: any = {}) => {
  const { method = 'GET', body, params } = options;
  // Strip /api/v1 if it exists because baseURL already has it
  const cleanUrl = url.replace(/^\/api\/v1/, '');

  const config = {
    method,
    url: cleanUrl,
    data: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined,
    params,
    headers: options.headers,
  };
  const response = await API(config);
  return response.data;
};

export default apiFetch;

