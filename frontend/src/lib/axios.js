import axios from 'axios'

const getApiBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) return envUrl.replace(/\/$/, "");
    return "";
};

const API_URL = getApiBaseUrl();

export const axiosInstance = axios.create({
    baseURL: API_URL ? `${API_URL}/api` : "/api",
    withCredentials: true,
})