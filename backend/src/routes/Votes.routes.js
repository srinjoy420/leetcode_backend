import {Router} from "express"
import { getVotes,getProblemVote } from "../controller/VoteRouter.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
const votesRouter=Router()
votesRouter.post("/:id/vote",authMiddleware,getVotes)
votesRouter.get("/:id",authMiddleware,getProblemVote)

export default votesRouter