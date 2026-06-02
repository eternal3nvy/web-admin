import axios from "axios";
const BASE_URL = "https://antiques-api.onrender.com/api/web"; // todo set via env

// for download counter testing on localhost
// const BASE_URL = "http://localhost:5000/api/web";

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