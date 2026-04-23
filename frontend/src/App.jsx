import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from "react-router-dom"
import HomePage from './page/HomePage'
import LoginPage from './page/LoginPage'
import SingUpPage from './page/SingUpPage'
import AddProblem from './page/AddProblem.jsx'
import { Toaster } from "react-hot-toast"
import { Loader } from "lucide-react"


import { useAuthStore } from './store/useAuthStore.js'
import LogoutPage from './page/LogoutPage.jsx'
import Layout from './layout/Layout.jsx'
import AdminRoute from './components/AdminRoute.jsx'



const App = () => {
  const { authUser, checkAuth, isCheckingauth } = useAuthStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingauth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className='felx flex-col items-center justify-start'>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
        </Route>

        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/singup' element={!authUser ? <SingUpPage /> : <Navigate to='/' />} />
        <Route path='/logout' element={authUser ? <LogoutPage /> : <Navigate to='/login' />} />

        <Route path="/add-problem" element={<AdminRoute />}>
          <Route
            index
            element={<AddProblem />}
          />
        </Route>
      </Routes>

    </div>
  )
}

export default App