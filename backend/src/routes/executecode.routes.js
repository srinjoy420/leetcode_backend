import {Router} from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { executeCode } from "../controller/executeCode.controller.js"

const executeCodeRouter=Router()

executeCodeRouter.post("/",authMiddleware,executeCode)

export default executeCodeRouter