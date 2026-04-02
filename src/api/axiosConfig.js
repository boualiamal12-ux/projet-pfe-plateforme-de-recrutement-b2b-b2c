import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
});

// ✅ FIX — mish Bearer parce que JwtUtil mish standard JWT
// El token format: base64(email:role:expiry) — Spring mish y3arfou comme Bearer JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token; // ← token direct sans "Bearer "
    }
    return config;
});

export default api;