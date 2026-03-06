import { prisma } from "../lib/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client"

export const Registeruser = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.staus(404).json({ "message": "please fill the credentials" })
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER,
            },
        });
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: error.message });

    }
}
export const Loginuser=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(400).json({"message":"please fill the credentials"})
    }
    try {
        const user=await prisma.user.findUnique({
            where:{email}
        })
        if(!user){
            return res.status(400).json({"message":"user not found"})
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({"message":"invalid credentials"})
        }
         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

         res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            message:"User created successfully",
            sucess:true,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                
            }
        })
        
        
    }
    catch(err){

    }
}
export const logOut=async(req,res)=>{
    try {
        res.clearCookie("jwt",{
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.status(200).json({
            sucess:true,
            message:"User logged out successfully"
        })
    } catch (error) {
        console.log("error creating user",error);
        res.status(500).json({
            message:"some problem occured "
        })
        
    }
}
export const getProfile=async(req,res)=>{
    try {
        const user=req.user
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        res.status(200).json({
            sucess:true,
            user
        })
    } catch (error) {
        console.log("error creating user",error);
        res.status(500).json({
            message:"some problem occured "
        })
        
    }
}