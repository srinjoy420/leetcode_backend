import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"

export const useActionStore = create((set) => ({
    isDeleating: false,
    deleteProblem: async (id) => {
        set({ isDeleating: true })
        try {
            const res = await axiosInstance.delete(`/problem/deleteProblem/${id}`)
            toast.success(res.data.message || "problem deleted successfully")
        } catch (error) {
            console.log("something has problem to delete the problem", error);
            toast.error("failed to delete the problem")
        }
        finally {
            set({ isDeleating: false })
        }
    }
}))