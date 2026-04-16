import React from 'react'
import { Route, Routes, Navigate } from "react-router-dom"
import HomePage from './page/HomePage'
import LoginPage from './page/LoginPage'
import SingUpPage from './page/SingUpPage'

const App = () => {
  let authUser = null
  return (
    <div className='felx flex-col items-center justify-start'>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/singup' element={!authUser ? <SingUpPage /> : <Navigate to='/' />} />
      </Routes>

    </div>
  )
}

export default App