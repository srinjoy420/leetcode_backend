import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import LogoutButton from '../components/LogoutButton.jsx';
import { LogOut } from 'lucide-react';

const Aboutme = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transition-all hover:shadow-2xl">
        
       
        <div className="p-6 pb-0 flex justify-center">
          <img
            src="/leetlab.svg"
            alt="Logo"
            className="w-12 h-12 cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate('/')}
          />
        </div>

        
        <div className="p-8 flex flex-col items-center text-center">
          
          
          <div className="w-28 h-28 rounded-full bg-slate-100 p-1 ring-4 ring-indigo-500/10 mb-6">
            <img
              src={authUser?.avatar || "https://robohash.org/yourtext?set=set1"}
              alt="avatar"
              className="w-full h-full object-cover rounded-full bg-slate-50"
            />
          </div>

          
          <div className="space-y-1 mb-8 w-full">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {authUser?.name || "Guest User"}
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 uppercase tracking-wider">
              {authUser?.role || "Member"}
            </span>
            <br/>
             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 uppercase tracking-wider">
              {authUser?.email || "jon@email.com"}
            </span>
          </div>

          <hr className="w-full border-slate-100 mb-6" />

         
          <div className="w-full">
            <LogoutButton>
              <div className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium rounded-xl transition-colors cursor-pointer group">
                <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Log Out</span>
              </div>
            </LogoutButton>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Aboutme;