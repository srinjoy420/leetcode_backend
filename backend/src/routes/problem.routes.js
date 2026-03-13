import {Router} from "express"
import { authMiddleware,isAdmin } from "../middleware/auth.middleware.js";
import { createproblem } from "../controller/problem.controller.js";

const problemrouter=Router()
problemrouter.post("/create-problem",authMiddleware,isAdmin,createproblem)

export default problemrouter