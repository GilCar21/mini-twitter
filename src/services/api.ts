import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // ← direto do store

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
