import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import { Link } from 'react-router-dom'


import { User, Code, LogOut } from "lucide-react"
import LogoutButton from './LogoutButton.jsx'

const Navbar = () => {
  const { authUser } = useAuthStore()

  

  return (
    <nav className="sticky top-0 z-50 w-full py-5">
      <div className="flex w-full items-center justify-between mx-auto max-w-4xl bg-black/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-gray-200/10 p-4 rounded-2xl">
        
        {/* Left — Logo + Brand */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <img
            src="/leetlab.svg"
            className="h-10 w-10 bg-primary/20 border-none px-2 py-2 rounded-full"
          />
          <span className="text-lg md:text-2xl font-bold tracking-tight text-white hidden md:block">
            Leetlab
          </span>
        </Link>

        {/* Right — User Dropdown */}
        {authUser && (
          <div className="flex items-center">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={authUser?.image || "https://robohash.org/yourtext?set=set1"}
                    alt="avatar"
                  />
                </div>
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
              >
                {/* Username */}
                <li>
                  <p className="text-base font-semibold pointer-events-none">
                    {authUser?.name}
                  </p>
                  <hr className="border-gray-200/10" />
                </li>

                {/* Profile */}
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center hover:bg-primary hover:text-white text-base font-semibold"
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </li>

                {/* Admin only */}
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/add-problem"
                      className="flex items-center hover:bg-primary hover:text-white text-base font-semibold"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Add Problem
                    </Link>
                  </li>
                )}

                {/* Logout */}
                <li>
                  <LogoutButton className="hover:bg-primary hover:text-white">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </LogoutButton>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar