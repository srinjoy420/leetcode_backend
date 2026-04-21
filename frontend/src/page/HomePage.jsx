import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div>
      HomePage
      <button 
        className='btn btn-error' 
        onClick={() => navigate('/logout')}
      >
        <LogOut className='w-4 h-4' />
        Logout
      </button>
    </div>
  )
}

export default HomePage