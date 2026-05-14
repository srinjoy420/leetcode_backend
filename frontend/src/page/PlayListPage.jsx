import React,{useEffect} from 'react'
import {Link} from "react-router-dom"
import { usePlayListStore } from '../store/usePlayListStore.js'
import {Loader} from "lucide-react"


const PlayListPage = () => {
    const {playlists,isLoading,getAllPlaylist}=usePlayListStore()
    useEffect(()=>{
        getAllPlaylist()
    },[getAllPlaylist])
    if(isLoading){
        return(
            <div className='flex items-center justify-center h-screen'>
                <Loader className='animate-spin'/>
            </div>
        )
    }
  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6'>
        Playlists
      </h1>
      <div className='className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"'>
        {playlists.map((playlist)=>(
            <Link key={playlist.id} to={`/playlist/${playlist.id}`} className='card bg-base-100 shadow-md border border-base-300 hover:shadow-xl transition-all'>
                <div className='card-body'>
                  <h2 className='card-title'>{playlist.name}</h2>
                  <p className='className="text-sm text-base-content/60'>{playlist.description}</p>
                  <div className='mt-4'>
                    <span>
                        {playlist.problems?.length || 0} problems
                    </span>

                  </div>

                </div>
            </Link>
        ))}
      </div>
        
    </div>
  )
}

export default PlayListPage