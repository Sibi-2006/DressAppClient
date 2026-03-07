import axios from 'axios';
import API_URL_CONFIG from '../config/api';

export const BASE_URL = API_URL_CONFIG;
export const API_URL = `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export default api;
