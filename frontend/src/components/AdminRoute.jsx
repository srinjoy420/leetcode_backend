import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Loader } from "lucide-react"
import { Navigate, Outlet } from 'react-router-dom'
const AdminRoute = () => {
    const { authUser, isCheckingauth } = useAuthStore()
    if (isCheckingauth) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        )
    }
    if (!authUser || authUser.role !== "ADMIN") {
        return <Navigate to="/" />
    }

    return (
        <Outlet />
    )
}

export default AdminRoute