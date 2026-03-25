import {Router} from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllsubmission, getallSubmissionFroProblem, getSubmissionforproblem } from "../controller/Submission.controller.js";


const submissionRouter=Router();
submissionRouter.get("/get-all-submission",authMiddleware,getAllsubmission)
submissionRouter.get("/get-submission/:problemId",authMiddleware,getSubmissionforproblem)
submissionRouter.get("/get-submission-count/:problemId",authMiddleware,getallSubmissionFroProblem)


export default submissionRouter