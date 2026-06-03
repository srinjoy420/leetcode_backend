import axios from "axios";
export const axiosInstance=axios.create({
     baseURL: `https://leetcode-backend-76wy.onrender.com/api/v1`,
    withCredentials:true
})