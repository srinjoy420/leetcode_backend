import { prisma } from "../lib/db.js";
export const getVotes = async (req, res) => {
   try {
    const userId=req.user.id;
    const{id:problemId}=req.params
    const {vote}=req.body
   } catch (error) {
    
   }
};