import axios from 'axios';

// Smart subdomain auto-detection with local dev fallback
const isBrowser = typeof window !== 'undefined';
const hostname = isBrowser ? window.location.hostname : '';

// 1. Python FastAPI Processing Base URL
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Production subdomain: https://api.yourdomain.com
  if (hostname && !hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const rootDomain = parts.slice(-2).join('.');
      return `https://api.${rootDomain}`;
    }
  }
  return '';
};

// 2. Node.js Admin Backend Base URL
const getAdminApiBaseUrl = () => {
  if (import.meta.env.VITE_ADMIN_API_URL) {
    return import.meta.env.VITE_ADMIN_API_URL;
  }
  // Production admin subdomain: https://admin.yourdomain.com/admin-api
  if (hostname && !hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const rootDomain = parts.slice(-2).join('.');
      return `https://admin.${rootDomain}/admin-api`;
    }
  }
  return '/admin-api';
};

export const API_BASE_URL = getApiBaseUrl();
export const ADMIN_API_BASE_URL = getAdminApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000,
});

export const adminClient = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  timeout: 30000,
});

// URL Normalizer: Ensures all tool requests have the proper /api/ prefix
apiClient.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith('/api') && !config.url.startsWith('http')) {
    config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      code: error.response?.data?.detail?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.detail?.message || error.response?.data?.message || error.message || 'An unexpected error occurred.',
      status: error.response?.status,
      details: error.response?.data?.detail?.details,
    };
    return Promise.reject(customError);
  }
);
