import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000`;
export const API_URL = `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export default api;
