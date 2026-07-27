import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: 'https://devflow-production-76a1.up.railway.app/api',
});

api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    // Get fresh ID token
    const token = await auth.currentUser.getIdToken(true);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
