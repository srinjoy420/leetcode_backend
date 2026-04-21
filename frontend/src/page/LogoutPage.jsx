import React, { useState } from 'react'
import { Code, LogOut, Loader2, ArrowLeft } from "lucide-react"
import { Link,useNavigate } from "react-router-dom"
import AuthImagePattern from '../components/AuthImagePattern.jsx'
import { useAuthStore } from '../store/useAuthStore.js'

const LogoutPage = () => {
  const { logout } = useAuthStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

const handleLogout = async () => {
  setIsLoggingOut(true)
  const success = await logout()
  if (success) {
    navigate('/login')   // ✅ only navigate when authUser is actually null
  }
  setIsLoggingOut(false)
}

  return (
    <div className='h-screen grid lg:grid-cols-2'>
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>

          {/* Logo */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <Code className='w-6 h-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Goodbye!</h1>
              <p className='text-base-content/60'>Are you sure you want to log out?</p>
            </div>
          </div>

          {/* Logout card */}
          <div className='bg-base-200 rounded-2xl p-6 space-y-4 text-center'>
            <div className='flex justify-center'>
              <div className='w-16 h-16 rounded-full bg-error/10 flex items-center justify-center'>
                <LogOut className='w-8 h-8 text-error' />
              </div>
            </div>
            <div>
              <h2 className='text-lg font-semibold'>Log out of your account</h2>
              <p className='text-base-content/60 text-sm mt-1'>
                You will be redirected to the login page and will need to sign in again to access your account.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className='space-y-3'>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className='btn btn-error w-full'
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className='animate-spin' />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className='w-4 h-4' />
                  Yes, Log me out
                </>
              )}
            </button>

            <Link to="/" className='btn btn-outline w-full'>
              <ArrowLeft className='w-4 h-4' />
              Cancel, take me back
            </Link>
          </div>

          {/* Footer note */}
          <div className='text-center'>
            <p className='text-base-content/60 text-sm'>
              Not your account?{' '}
              <Link to="/singup" className='link link-primary'>
                Sign up here
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Right side image */}
      <AuthImagePattern
        title={"See you soon!"}
        subtitle={"Your data is safe and we'll be here when you return."}
      />
    </div>
  )
}

export default LogoutPage