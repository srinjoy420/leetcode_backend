import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"


export const useVoteStore=create((set)=>({
    votes:{},
    isVoting:false,

    voteProblem:async(id,vote)=>{
        set({isVoting:true})

        try {
            const res=await axiosInstance.post(`/votes/${id}/vote`,{vote})
            set((state) => ({
                votes: {
                    ...state.votes,
                    [id]: {
                        upVotes: res.data.upVotes,
                        downVotes: res.data.downVotes,
                        userVote: res.data.userVote,
                    },
                },
            }));
            
            toast.success(res.data.message || "vote added succesfully")
        } catch (error) {
            toast.error(error.response?.data?.error || "cant added vote")


            
        }
        finally{
            set({isVoting:false})
        }
    }
}))