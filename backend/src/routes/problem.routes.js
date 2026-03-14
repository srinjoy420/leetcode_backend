import {Router} from "express"
import { authMiddleware,isAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, getallProblems,getProblemById, updateProblem } from "../controller/problem.controller.js";

const problemrouter=Router()
problemrouter.post("/create-problem",authMiddleware,isAdmin,createProblem)
problemrouter.get("/getallproblems",authMiddleware,getallProblems)
problemrouter.get("/getproblem/:id",authMiddleware,getProblemById)
problemrouter.put("/updateProblem/:id",authMiddleware,isAdmin,updateProblem)
problemrouter.delete("/deleteProblem/:id",authMiddleware,isAdmin,deleteProblem)

export default problemrouter