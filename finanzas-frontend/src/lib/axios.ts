import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// CSRF wrapper logic if needed by Laravel Sanctum
api.interceptors.request.use(async (config) => {
    return config;
});

export default api;
