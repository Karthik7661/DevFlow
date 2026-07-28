import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: 'https://backend-six-gamma-28.vercel.app/api',
  headers: {
    'Bypass-Tunnel-Reminder': 'true'
  }
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
