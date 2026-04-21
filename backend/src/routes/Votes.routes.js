import {Router} from "express"
import { getVotes } from "../controller/VoteRouter.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
const votesRouter=Router()
votesRouter.post("/:id/vote",authMiddleware,getVotes)

export default votesRouter