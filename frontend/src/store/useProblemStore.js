import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"

export const useProblemStore=create((set)=>({
    problems:[],
    problem:null,
    solvedProblems:[],
    isProblemsLoading:false,
    isProblemLoading:false,

    //get all probolems
    getallProblems:async()=>{
        set({isProblemsLoading:true})
        try {
            const res=await axiosInstance.get("/problem/getallproblems")
            console.log("succesfully get all problems",res.data.problems);
            set({problems:res.data.problems})
            toast.success(res.data.message || "succesfully get all problems")
            
        } catch (error) {
            console.log("error to fetching the porblem",error);
            set({problems:[]})
            toast.error("failed to get all problems")
            
            
        }
        finally{
            set({isProblemsLoading:false})

        }
    },
    getProblemByid:async(id)=>{
        set({isProblemLoading:true})
        try {
            const res=await axiosInstance.get(`/problem/getproblem/${id}`)
            console.log("succesfully get the problem",res.data.problem);
            set({problem:res.data.problem})
            toast.success(res.data.message || "succesfully get the problem")
            
        } catch (error) {
            console.log("cxant fetch the the problem ",error);
            set({problem:null})
            toast.error("failed to get the problem")
            
            
        }
        finally{
            set({isProblemLoading:false})}

    },
    getSolvedProblemByUser:async()=>{
        try {
            const res=await axiosInstance.get("/problem/get-all-solved")
            set({solvedProblems:res.data.problems})
            toast.success(res.data.message || "succesfully get the problem")
        } catch (error) {
            console.log("cant find all solutions");
            
        }
    }


}))