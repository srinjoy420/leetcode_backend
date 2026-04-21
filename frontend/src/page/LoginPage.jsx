import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Code, Mail, EyeOff, Loader2, Lock, Eye } from "lucide-react"
import { z } from "zod"
import AuthImagePattern from '../components/AuthImagePattern'
import { useAuthStore } from '../store/useAuthStore.js'
const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Min six characters required")
})

const LoginPage = () => {
  const { login, isLoggedIn } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(LoginSchema) })
  const onsubmit = async (data) => {
    try {
      await login(data)
      
    } catch (error) {
      console.log("there is a problem is login",error);
      
    }

  }
  return (
    <div className='h-screen grid lg:grid-cols-2'>
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* logo */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <Code className='w-6 h-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Welcome</h1>
              <p className='text-base-content/60'>Login  to your account</p>
            </div>
          </div>

          {/* from */}
          <form onSubmit={handleSubmit(onsubmit)} className='space-y-6'>
            {/* email */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>

              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-base-content/40' />
                </div>
                <input
                  type='text'
                  {...register("email")}
                  className={`input input-bordered w-full pl-10 ${errors.email ? "input-error" : ""}`}
                  placeholder='app@gmail.com'
                />

              </div>
              {
                errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )
              }

            </div>
            {/* password */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-base-content/40' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register("password")}
                  className={`input input-bordered w-full pl-10 ${errors.password ? "input-error" : ""}`}
                  placeholder='*********'
                />
                <button
                  type='button'
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            {/* submit */}
           <button type='submit' className='btn btn-primary w-full' disabled={isLoggedIn}>
                         {isLoggedIn ? (
                           <>
                             <Loader2 className="animate-spin" />
                             Loading...
                           </>
                         ) : (
                           "Login"
                         )}
                       </button>


          </form>
          <div className='text-center'>
            <p className='text-base-content/60'>dont have an account? {" "}</p>
            <Link to="/singup" className='link link-primary'>Sing up</Link>

          </div>
        </div>
      </div>
      {/* right side image */}
      <AuthImagePattern
        title={"Welcome to our platform"}
        subtitle={"login to your account"}
      />

    </div>
  )
}

export default LoginPage