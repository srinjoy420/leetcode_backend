import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"


export const useProblemStore = create((set, get) => ({
    problems: [],
    problem: null,
    solvedProblems: [],
    isProblemsLoading: false,
    isProblemLoading: false,
    iseExecuting: false,
    submission: null,

    getallProblems: async ({ silent = false } = {}) => {
        set({ isProblemsLoading: true })
        try {
            const res = await axiosInstance.get("/problem/getallproblems")
            set({ problems: res.data.problems })
            if (!silent) {
                toast.success(res.data.message || "succesfully get all problems")
            }
        } catch (error) {
            console.log("error to fetching the porblem", error)
            set({ problems: [] })
            if (!silent) {
                toast.error("failed to get all problems")
            }
        } finally {
            set({ isProblemsLoading: false })
        }
    },

    getProblemByid: async (id) => {
        set({ isProblemLoading: true, submission: null, problem: null })
        try {
            const res = await axiosInstance.get(`/problem/getproblem/${id}`)
            set({ problem: res.data.problem })
            toast.success(res.data.message || "succesfully get the problem")
        } catch (error) {
            console.log("cxant fetch the the problem ", error)
            set({ problem: null })
            toast.error("failed to get the problem")
        } finally {
            set({ isProblemLoading: false })
        }
    },

    getSolvedProblemByUser: async () => {
        try {
            const res = await axiosInstance.get("/problem/get-all-solved")
            set({ solvedProblems: res.data.problems })
            toast.success(res.data.message || "succesfully get the problem")
        } catch (error) {
            console.log("cant find all solutions")
        }
    },

    exeCuteCode: async (data) => {
        set({ iseExecuting: true })
        try {
            const res = await axiosInstance.post("/executecode", data)
            set({ submission: res.data.submission })
            toast.success(res.data.message || "Code executed successfully")
        } catch (error) {
            set({ submission: null })
            toast.error(error.response?.data?.error || "Execution failed")
        } finally {
            set({ iseExecuting: false })
        }
    },

    updateProblem: async (id, data) => {
        set({ isProblemLoading: true })

        try {
            const res = await axiosInstance.put(
                `/problem/updateProblem/${id}`,
                data
            )

            const updatedProblem = res.data.problem
            if (!updatedProblem) {
                toast.error("Update succeeded but no problem was returned")
                return false
            }

            const problemId = String(id)
            set((state) => ({
                problem: updatedProblem,
                problems: state.problems.map((p) =>
                    String(p.id) === problemId
                        ? { ...p, ...updatedProblem }
                        : p
                ),
            }))

            await get().getallProblems({ silent: true })

            toast.success(
                res.data.message || "Problem updated successfully"
            )

            return true
        } catch (error) {
            console.log("there is a problem updating", error)

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "failed to update the problem"
            )

            return false
        } finally {
            set({ isProblemLoading: false })
        }
    },
}))
