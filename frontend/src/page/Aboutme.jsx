import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import LogoutButton from '../components/LogoutButton.jsx';
import { LogOut } from 'lucide-react';
import {LoaderIcon} from "lucide-react"

const Aboutme = () => {
  const navigate = useNavigate();
  const { authUser, updateProfilepic, isUpdatingProfilepic } = useAuthStore();
  const [selectTedImage, setSelectedImage] = useState(null)

  const fileInputRef = useRef(null)
  //the compressImageSize
  const comPressedImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target.result

        img.onload = () => {
          const canvas = document.createElement("canvas")
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxWidth) {
              width = (width * maxWidth) / height
              height = maxWidth
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
          resolve(compressedBase64)
        }

      }
    })
  }
  //handel image upload
  const handelImageUpload=async(e)=>{
    const file=e.target.files[0]
    if(!file) return

    try {
      const compresImage=await comPressedImage(file,800,0.8)
      setSelectedImage(compresImage)

      const result=await updateProfilepic(compresImage)
      if(result.success){

      }
    } catch (error) {
       console.error("Error uploading image:", error)
      
    }
  }

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
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={()=>!isUpdatingProfilepic && fileInputRef.current.click()}
            >
              <img
              src={selectTedImage||authUser?.profilePic || "https://robohash.org/yourtext?set=set1"}
              alt="avatar"
              className="w-full h-full object-cover rounded-full bg-slate-50"
            />
            {
              isUpdatingProfilepic && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <LoaderIcon className="size-5 text-white animate-spin"/>

                </div>
              )
            }
            {!isUpdatingProfilepic && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Change</span>
                </div>
              )}
            </button>
            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handelImageUpload}
              className='hidden'
              disabled={isUpdatingProfilepic}
            />
          </div>


          <div className="space-y-1 mb-8 w-full">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {authUser?.name || "Guest User"}
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 uppercase tracking-wider">
              {authUser?.role || "Member"}
            </span>
            <br />
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