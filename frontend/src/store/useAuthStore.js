import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"


export const useAuthStore = create((set) => ({
    authUser: null,
    isSinginUp: false,
    isLoggedIn: false,
    isCheckingauth: false,
    // create utilities for auth user
    checkAuth: async () => {
        set({ isCheckingauth: true })
        try {
            const res = await axiosInstance.get("/auth/profile")
            console.log("the data of the current user");
            set({ authUser: res.data.user })
            toast.success(res.data.message || "profile fetched succesfully")

        } catch (error) {
            console.log("there is some error check  the user", error);
            set({ authUser: null })
            toast.error("there is a problem the fexthc ")


        }
        finally {
            set({ isCheckingauth: false })
        }
    },
    singUp: async (data) => {
        set({ isSinginUp: true })
        try {
            const res = await axiosInstance.post("/auth/register", data)
            console.log("the regiser user ", res.data);
            set({ authUser: res.data.user })
            toast.success(res.data.message || "succesfully singup")

        } catch (error) {
            console.log("some problem in singingup", error);
            toast.error("failed to singup")


        }
        finally {
            set({ isSinginUp: false })
        }

    },
    login: async (data) => {
        set({ isLoggedIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            console.log("the regiser user ", res.data);
            set({ authUser: res.data.user })
            toast.success(res.data.message || "succesfully login")
        } catch (error) {
            console.log("the error in login", error);
            toast.error("failed to login")

        }
        finally {
            set({ isLoggedIn: false })
        }
    },
    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success(res.data.message || "successfully logout")
            return true   
        } catch (error) {
            console.log("error in logging out", error)
            toast.error("failed to logout")
            return false  
        }
    }
}))
