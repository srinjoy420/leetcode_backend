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
                playlists: [...state.playlists, res.data.playList]  // capital L
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
            //i create a typo in my backend there i create the name as problems so i have to give problems
            console.log((res.data.problems));
            set({ playlists: res.data.problems })
            toast.success(res.data.message || "fetch all playlist succesfully")

        } catch (error) {
            console.log("theree is a error in creating the playlist", error);
            set({ playlists: [] })
            toast.error("failed to fetch all playlist")


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
            toast.success("succesfully get the playlist")

        } catch (error) {
            console.error("cannot get the playlist", error)
            set({ currentPlayList: null })
            toast.error("playlist fetching unsucessfull")

        }
        finally {
            set({ isLoading: false })
        }
    },
    probLemaddToPlaylist: async ( playlistId,problemIds) => {
        set({ isLoading: true })
        try {
            const res = await axiosInstance.post(`/playlist/${playlistId}/add-problem`, {
                problemIds
            })
            toast.success("problem succesfully added to the polaylist")
            if (get().currentPlayList?.id === playlistId) {
                await get().getPlaylistDetails(playlistId)
            }
        } catch (error) {
            console.log("problem adding a playlist to the playlistId", error);
            toast.error("problem adding a playlist to the playlistId")


        }
        finally {
            set({ isLoading: false })
        }
    },
    problemRemoveFromPlaylist: async (problemIds, playlistId) => {
        set({ isLoading: true })
        try {
            const res = await axiosInstance.delete(`/playlist/${playlistId}/delete-problem`, {
                problemIds

            })
            toast.success("problem succesfully removed from the playlist")
            if (get().currentPlayList?.id === playlistId) {
                await get().getPlaylistDetails(playlistId)
            }
        } catch (error) {
            console.log("problem adding a playlist to the playlistId", error);
            toast.error("problem adding a playlist to the playlistId")


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
        } catch (error) {
            console.log("the playlist deleting error",error);
            toast.error("failed to delete playlist")
            
        }
        finally{
            set({isLoading:true})
        }

    }
}))