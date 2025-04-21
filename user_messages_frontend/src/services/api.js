// src/services/api.js
import axios from 'axios';

// URL del backend
const BASE_URL = 'http://localhost:8000/api/';

// Obtenemos el token desde localStorage

const getAccessToken = () => localStorage.getItem("access");

const api = axios.create({
    baseURL: BASE_URL,
});

// Interceptor para agregar automáticamente el token a cada request
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;

// Crea una instancia de Axios con base en http://localhost:8000/api/
// Añade automáticamente el token Bearer ACCESS_TOKEN a todas las peticiones si el token está guardado en localStorage