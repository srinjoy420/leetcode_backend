import {Router} from "express"
import { authMiddleware,isAdmin } from "../middleware/auth.middleware.js";
import { createProblem } from "../controller/problem.controller.js";

const problemrouter=Router()
problemrouter.post("/create-problem",authMiddleware,isAdmin,createProblem)

export default problemrouter