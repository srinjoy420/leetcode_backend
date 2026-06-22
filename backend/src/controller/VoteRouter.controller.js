import { prisma } from "../lib/db.js";
export const getVotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: problemId } = req.params;
        const { vote } = req.body;

        let userVote=null

        await prisma.$transaction(async (tx) => {

            const existing = await tx.problemRating.findUnique({
                where: {
                    userId_problemId: { userId, problemId }
                }
            });

           
            if (!existing) {
                await tx.problemRating.create({
                    data: { userId, problemId, vote }
                });

                await tx.problem.update({
                    where: { id: problemId },
                    data: {
                        upVotes: { increment: vote === "UPVOTE" ? 1 : 0 },
                        downVotes: { increment: vote === "DOWNVOTE" ? 1 : 0 }
                    }
                });
            }

            // ✅ Case 2: Same vote → remove
            else if (existing.vote === vote) {
                await tx.problemRating.delete({
                    where: { id: existing.id }
                });

                await tx.problem.update({
                    where: { id: problemId },
                    data: {
                        upVotes: { decrement: vote === "UPVOTE" ? 1 : 0 },
                        downVotes: { decrement: vote === "DOWNVOTE" ? 1 : 0 }
                    }
                });
                userVote=null
            }

            // ✅ Case 3: Switch vote
            else {
                await tx.problemRating.update({
                    where: { id: existing.id },
                    data: { vote }
                });

                await tx.problem.update({
                    where: { id: problemId },
                    data: {
                        upVotes: {
                            increment: vote === "UPVOTE" ? 1 : -1
                        },
                        downVotes: {
                            increment: vote === "DOWNVOTE" ? 1 : -1
                        }
                    }
                });
                userVote=vote
            }
        });

        // get latest count
        const updateProblem=await prisma.problem.findUnique({
            where:{
                id:problemId
            },
            select:{
                upVotes:true,
                downVotes:true
            }
        })

        res.status(200).json({ message: "Vote handled successfully",
            upVotes:updateProblem.upVotes,
            downVotes:updateProblem.downVotes,
            userVote
         });

    } catch (error) {
    console.log("FULL ERROR 👉", error);
    console.log("MESSAGE 👉", error.message);
    console.log("META 👉", error.meta);

    res.status(400).json({ 
        error: error.message,
        meta: error.meta
    });
}
};