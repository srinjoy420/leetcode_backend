import { prisma } from "../lib/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

export const authMiddleware=async(req,res,next)=>{
   try {
    console.log(req.cookies);
    
     const token=req.cookies.jwt
       if(!token){
            return res.status(401).json({
                message:"Unauthorized no token provided"
            })
        }
        let decode;
        try {
            decode=jwt.verify(token,process.env.JWT_SECRET)
            console.log(decode);
            
            
        } catch (error) {
            return res.status(401).json({
                message:"Unauthorized invalid token"
            })
            
        }
        const user=await prisma.user.findUnique({
             where:{id:decode.id},
            select:{
                id:true,
                
                name:true,
                email:true,
                role:true
            }
        })
         if(!user){
            return res.status(401).json({
                message:"Unauthorized user not found"
            })
        }
        req.user=user
        next()
     
   } catch (error) {
    console.log("error in auth middleware",error);
        res.status(500).json({
            message:"some problem occured "
        })
    
   }
}

