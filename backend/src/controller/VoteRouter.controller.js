import { prisma } from "../lib/db.js";
export const getVotes = async (req, res) => {
   try {
    const userId=req.user.id;
    const{id:problemId}=req.params
    const {vote}=req.body
    //validate vote
    if(vote!=='UPVOTE' && vote!=='DOWNVOTE'){
      return res.status(400).json({
         message:"invalid votr type",
         success:false
      })
    }
    let userVote=null
    await prisma.$transaction(async(tx)=>{
      const existing=await tx.problemRating.findUnique({
         where:{
            userId_problemId:{
               userId,
               problemId
            }
         }
      });
      //  case1 :user has not votr before
      if(!existing){
         await tx.problemRating.create({
            data:{
               userId,
               problemId,
               vote
            }
         });
         await tx.problem.update({
            where:{
               id:problemId
            },
            data:{
               upVotes:{
                  increment:vote==="UPVOTE"?1:0
               },
               downVotes:{
                  increment:vote==='DOWNVOTE'?1:0
               }
            }
         });
         userVote=vote
      }
      //case2 if user clicks the same vote again the vote remove
      else if(existing.vote===vote){
         await tx.problemRating.delete({
            where :{
               id:existing.id
            }
         });
         await tx.problem.update({
            where:{
               id:problemId
            },
            data:{
               upVotes:{
                  decrement:vote==="UPVOTE"?1:0
               },
               downVotes:{
                  decrement:vote==="DOWNVOTE"?1:0
               }
            }
         });
         userVote=null
      }
      // case 3 if votes changes the vote like became dislike 
      //example upvote to downvote
      else{
         await tx.problemRating.update({
            where:{
               id:existing.id
            },
            data:{
               vote
            }
         });
         await tx.problem.update({
            where:{
               id:problemId
            },
            data:{
               upVotes:{
                  increment:vote==='UPVOTE'?1:-1
               },
               downVotes:{
                  increment:vote==="DOWNVOTE"?1:-1
               }
            }
         });
         userVote=vote
      }
    });
    //Get latest voteCount
    const updateProblem=await prisma.problem.findUnique({
      where:{
         id:problemId
      },
      select:{
         upVotes:true,
         downVotes:true
      }
    });
    return res.status(200).json({
      success:true,
      message:"vote handled succesfully",
      upVotes:updateProblem.upVotes,
      downVotes:updateProblem.downVotes,
      userVote
    })
   
   
   } catch (error) {
    
   }
};

//get totalvotes + current usersvote
export const getProblemVote=async(req,res)=>{
   try {
      const userId=req.user.id;
      const {id:problemId}=req.params
      //get total votecounts
      const problem=await prisma.problem.findUnique({
         where:{
            id:problemId
         },
         select:{
            upVotes:true,
            downVotes:true
         }
      });
      if(!problem){
         return res.status(404).json({
            success:false,
            message:"problem not found"
         })
      }
      // find current user's vote
      const existingVote=await prisma.problemRating.findUnique({
         where:{
            userId_problemId:{
               userId,
               problemId
            }
         }
      });
      return res.status(200).json({
         success:true,
         upVotes:problem.upVotes,
         downVotes:problem.downVotes,
         userVote:existingVote?.vote || null

      })

   } catch (error) {
      console.log("GERT vote error",error);
      return res.status(500).json({
         success:false,
         error:error.message
      })
      
   }
}