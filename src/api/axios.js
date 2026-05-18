import axios from "axios";
const BASE_URL = "http://localhost:5000/api/web"; // todo set via env


const api = axios.create({
    baseURL: BASE_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token)
        config.headers.Authorization = `Bearer ${token}`;

    return config;
})

export default api;