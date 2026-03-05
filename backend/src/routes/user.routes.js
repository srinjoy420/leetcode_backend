import {Router} from "express"
import { Loginuser, Registeruser,getProfile,logOut } from "../controller/User.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const userroutes=Router()
userroutes.post("/register",Registeruser)
userroutes.post("/login",Loginuser)
userroutes.post("/logout",authMiddleware,logOut)
userroutes.get("/profile",authMiddleware,getProfile)

export default userroutes;