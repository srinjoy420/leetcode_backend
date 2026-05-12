import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"



export const usePlayListStore = create((set, get) => ({
    playlists: [],
    currentPlayList: null,
    isLoading: false,
    error: null,
    isDeleating:false,
    // create Utiltes for the plalist
    createPlaylist: async (data) => {
        set({ isLoading: true })
        try {
            const res = await axiosInstance.post("/playlist/create", data)
            console.log(res.data.playlist);

            set((state) => ({
                playlists: [...state.playlists, res.data.playList]
            }))
            toast.success(res.data.message || "playlist added succesfully")
        } catch (error) {
            console.error('error in creating a problem', error);
            toast.error(error.response?.data?.message || "failed to create playlist")
            throw error

        }
        finally {
            set({ isLoading: false })
        }
    },
    getAllPlaylist: async () => {
        set({ isLoading: true })
        try {
            const res = await axiosInstance.get("/playlist/getall-playlist")
            set({ playlists: res.data.problems ?? [] })

        } catch (error) {
            console.log("theree is a error in creating the playlist", error);
            set({ playlists: [] })
            toast.error(error.response?.data?.message || "failed to fetch all playlist")


        }
        finally {
            set({ isLoading: false })
        }
    },
    getPlaylistDetails: async (id) => {
        set({ isLoading: true })
        try {
            const res = await axiosInstance.get(`/playlist/${id}`)
            console.log("succesfully get the problem", res.data.Playlist);
            set({ currentPlayList: res.data.Playlist })

        } catch (error) {
            console.error("cannot get the playlist", error)
            set({ currentPlayList: null })
            toast.error("playlist fetching unsucessfull")

        }
        finally {
            set({ isLoading: false })
        }
    },
    probLemaddToPlaylist: async (playlistId, problemIds) => {
        set({ isLoading: true })
        const normalizedIds = (Array.isArray(problemIds) ? problemIds : [])
            .map((id) => String(id))
            .filter(Boolean)
        if (normalizedIds.length === 0) {
            toast.error("no problem selected")
            set({ isLoading: false })
            return
        }
        try {
            const res = await axiosInstance.post(`/playlist/${playlistId}/add-problem`, {
                problemIds: normalizedIds
            })
            const msg = res.data?.message || "problem succesfully added to the polaylist"
            if (res.data?.problemsInPlaylist?.count === 0) {
                toast(msg, { icon: "ℹ️" })
            } else {
                toast.success(msg)
            }
            if (String(get().currentPlayList?.id) === String(playlistId)) {
                await get().getPlaylistDetails(playlistId)
            }
        } catch (error) {
            console.log("problem adding a playlist to the playlistId", error);
            toast.error(error.response?.data?.message || "error adding problem to playlist")


        }
        finally {
            set({ isLoading: false })
        }
    },
    problemRemoveFromPlaylist: async (problemIds, playlistId) => {
        set({ isLoading: true })
        try {
            const res = await axiosInstance.delete(`/playlist/${playlistId}/delete-problem`, {
                data: { problemIds }
            })
            toast.success("problem succesfully removed from the playlist")
            if (String(get().currentPlayList?.id) === String(playlistId)) {
                await get().getPlaylistDetails(playlistId)
            }
        } catch (error) {
            console.log("problem adding a playlist to the playlistId", error);
            toast.error(error.response?.data?.message || "error removing problem from playlist")


        }
        finally{
             set({ isLoading: false })
        }
    },
    deletePlaylist:async(id)=>{
        set({isLoading:true})
        try {
            const res=await axiosInstance.delete(`/playlist/delete/${id}`)
            toast.success(res.data.message || "playlist delete succesfully")
            set((state) => ({
                playlists: state.playlists.filter((p) => p.id !== id),
                currentPlayList: state.currentPlayList?.id === id ? null : state.currentPlayList
            }))
        } catch (error) {
            console.log("the playlist deleting error",error);
            toast.error("failed to delete playlist")
            
        }
        finally{
            set({isLoading:false})
        }

    }
}))