import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'



const LogoutButton = ({children}) => {
    const {logout}=useAuthStore()
    const onLogout=async()=>{
        await logout()
    }
  return (
    <button onClick={onLogout} className="w-full">
      {children}
    </button>
  )
}

export default LogoutButton