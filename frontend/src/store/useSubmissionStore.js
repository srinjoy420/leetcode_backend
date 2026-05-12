import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"

export const useSubmissionStore=create((set)=>({
    isLoading:false,
    submissions:[],
    submissionCount:null,

    getAllSubmission:async()=>{
        set({isLoading:true})
        try {
            const res=await axiosInstance.get("/submission/get-all-submission")
            console.log(res.data.submissions);
            set({submissions:res.data.submissions})
            toast.success(res.data.message || "succesfully get all submission")
            
        } catch (error) {
            console.log("cant find all of the submissions",error);
            set({submissions:[]})
            toast.error("failed to get all submission")
            
            
        }finally{
            set({isLoading:false})
        }
    },
    getSubmissionforProblem:async(problemId)=>{
        set({isLoading:true})
        try {
            const res=await axiosInstance.get(`/submission/get-submission/${problemId}`)
            console.log(res.data.submissions);
            
            set({submissions:res.data.submissions})
              toast.success(res.data.message || "succesfully get all submission")
        } catch (error) {
            console.log("cant find all of the submissions",error);
            set({submissions:[]})
            toast.error("failed to get all submission")
            
        }
        finally{
            set({isLoading:false})
        }
    },
    getSubmissioncountForProblem:async(problemId)=>{
        set({isLoading:true})
        try {
            const res=await axiosInstance.get(`/submission/get-submission-count/${problemId}`)
            console.log(res.data.count);
            
            set({submissionCount:res.data.count})
            toast.success(res.data.message||"the submisson count fetched successfully")

        } catch (error) {
            console.log("there is some problem in getting Submission",error);
            set({submissionCount:null})
            toast.error("failed to get all submission")
            
            
        }finally{
            set({isLoading:false})
        }
    }
}))