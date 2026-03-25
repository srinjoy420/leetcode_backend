import { prisma } from "../lib/db.js";

export const getAllsubmission=async(req,res)=>{
    const userId=req.user.id;
    if(!userId){
        return res.status(404).json({message:"user not found"});

    }
    try {
        const submissions=await prisma.submission.findMany({
            where:{
                userId:userId
            }

        })
        res.status(200).json({
            success:true,
            message:"the submissions fetched successfully",
            submissions
        })
    } catch (error) {
        console.log("error to get",error);
     res.status(400).json({
        message:"cant get id succesfully",
        success:false
    })
        
    }
}
export const getSubmissionforproblem=async(req,res)=>{
    const userId=req.user.id;
    const problemId=req.params.problemId
    if(!userId){
        return res.status(404).json({message:"user not found"});
    }
    try {
        const submissions=await prisma.submission.findMany({
            where:{
                userId:userId,
                problemId:problemId
            }
        })
        res.status(200).json({
            success:true,
            message:"the submissions fetched successfully",
            submissions
        })
    } catch (error) {
        console.log("error to get",error); 
        res.status(400).json({
            message:"cant get id succesfully",
            success:false
        })
        
    }
}
export const getallSubmissionFroProblem=async(req,res)=>{
    try {
         const problemId=req.params.problemId
         const submissions=await prisma.submission.count({
            where:{
                problemId:problemId
            }
         })
         res.status(200).json({
            success:true,
            message:"the submissions fetched successfully",
            count:submissions
         })
    } catch (error) {
        console.log("error to get",error);
        res.status(400).json({
            message:"cant get id succesfully",
            success:false
        })
        
    }

}