import axios from "axios"

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "")

export const axiosInstance = axios.create({
    baseURL: `${apiBaseUrl}/api/v1`,
    withCredentials: true,
})