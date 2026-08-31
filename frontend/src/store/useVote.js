import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"


export const useVoteStore=create((set)=>({
    votes:{},
    isVoting:false,
    isLoadingVote:false,
    getProblemVote:async(problemId)=>{
        set({isLoadingVote:true})
        try {
            const res=await axiosInstance.get(`/votes/${problemId}`)
            set((state)=>({
                votes:{
                    ...state.votes,
                    [problemId]:{
                        upVotes:res.data.upVotes,
                        downVotes:res.data.downVotes,
                        userVote:res.data.userVote
                    }
                }
            }))
        } catch (error) {
            console.log("Error getting vote",error);
            toast.error(
                error.response?.data?.error || "failed fatch votes"
            )
            
            
        }
        finally{
            set({isLoadingVote:false})
        }
    },
    // upvote /downvote
    voteProblem:async(problemId,vote)=>{
        set({isVoting:true})
        try {
            const res=await axiosInstance.post(
                `/votes/${problemId}/vote`,{vote}
            )
            set((state)=>({
                votes:{
                    ...state.votes,
                    [problemId]:{
                        upVotes:res.data.upVotes,
                        downVotes:res.data.downVotes,
                        userVote:res.data.userVote
                    }
                }
            }))
            toast.success(
                res.data.message || "vote update succesfully"
            )
        } catch (error) {
            console.log("error voting",error);
            toast.error(
                error.response?.data?.error || "failed to vote"
            )
            
        }
    }
}))