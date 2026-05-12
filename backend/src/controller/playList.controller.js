import { prisma } from "../lib/db.js";
export const createPlaylist = async (req, res) => {
    const { name, description } = req.body;
    try {
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "the name is required"
            })
        }
        const playList = await prisma.playlist.create({
            data: {
                name,
                description,
                userId: req.user.id
            }
        })
        res.status(200).json({
            success: true,
            message: "the playlist created successfully",
            playList
        })
    } catch (error) {
        console.log("error the create a playlist");
        res.status(404).json({
            success: false,
            message: "the problem in reating a playlist"
        })


    }

}
export const getallPlaylist = async (req, res) => {
    try {
        const problems = await prisma.playlist.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }

        })
        res.status(200).json({
            success: true,
            message: "the playlist fetched successfully",
            problems: problems ?? []
        })
    } catch (error) {
        console.log("error in fetching all playlist", error);
        res.status(404).json({
            success: false,
            message: "the problem in fetching all playlist"
        })

    }
}
export const getPlaylistById = async (req, res) => {
    const { playlistId } = req.params
    try {
        if (!playlistId) {
            return res.status(400).json({
                success: false,
                message: "the id is required"
            })
        }
        const Playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })
        if (!Playlist) {
            return res.status(400).json({
                success: true,
                message: "the playlist not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "the playlist fetched successfully",
            Playlist
        })
    } catch (error) {
        console.log("error in fetching a playlist", error);
        res.status(404).json({
            success: false,
            message: "the problem in fetching a playlist"
        })

    }
}
export const addProblemtoPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;
    try {
        if (!playlistId) {
            return res.status(400).json({
                success: false,
                message: "the playlist id is required"
            })
        }
        if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "the problem id is required"
            })
        }

        const uniqueIds = [
            ...new Set(
                problemIds
                    .map((id) => (id == null ? "" : String(id).trim()))
                    .filter(Boolean)
            )
        ]
        if (uniqueIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "the problem id is required"
            })
        }

        const playlist = await prisma.playlist.findFirst({
            where: { id: playlistId, userId: req.user.id },
            select: { id: true }
        })
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "playlist not found"
            })
        }

        const existingProblems = await prisma.problem.findMany({
            where: { id: { in: uniqueIds } },
            select: { id: true }
        })
        if (existingProblems.length !== uniqueIds.length) {
            return res.status(400).json({
                success: false,
                message: "one or more problems do not exist"
            })
        }

        const problemsInPlaylist = await prisma.problemInPlaylist.createMany({
            data: uniqueIds.map((problemId) => ({
                playListId: playlistId,
                problemId
            })),
            skipDuplicates: true
        })

        const message =
            problemsInPlaylist.count === 0
                ? "those problems are already in this playlist"
                : "the problem added to playlist successfully"

        return res.status(200).json({
            success: true,
            message,
            problemsInPlaylist
        })
    } catch (error) {
        console.error("error in add problem to playlist", error);
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "problem is already in this playlist"
            })
        }
        if (error.code === "P2003") {
            return res.status(400).json({
                success: false,
                message: "invalid playlist or problem reference"
            })
        }
        return res.status(500).json({
            success: false,
            message: "error in adding problem to playlist"
        })
    }
}

export const  deletePlaylist=async(req,res)=>{
    const {playlistId}=req.params;
    try {
        if(!playlistId){
            return res.status(400).json({
                success:false,
                message:"the playlist id is required"
            })
        }
        const playlist=await prisma.playlist.delete({
            where:{
                id:playlistId
            }
        })
        res.status(200).json({
            success:true,            message:"the playlist deleted successfully",
            playlist
        })
    } catch (error) {
        console.log("the error in deleting a playlist",error);
        res.status(404).json({
            success:false,
            message:"the problem in deleting a playlist"
        })
        
        
    }
}

export const deleteProblemFromPlayList=async(req,res)=>{
    const {playlistId}=req.params;
    const {problemIds}=req.body;
    try {
        if(!playlistId){
            return res.status(400).json({
                success:false,
                message:"the playlist id is required"
            })
        }
        if(!Array.isArray(problemIds) || problemIds.length===0){
            return res.status(400).json({
                success:false,
                message:"the problem id is required"
            })
            

        }
        const deleteProblem=await prisma.problemInPlaylist.deleteMany({
                where:{
                    playListId:playlistId,
                    problemId:{
                        in:problemIds
                    }
                }
            })
        res.status(200).json({
            success:true,
            message:"the problem deleted from playlist successfully",
            deleteProblem
        })
        
    } catch (error) {
        console.log("the error in deleting a problem from playlist",error);
        res.status(404).json({
            success:false,
            message:"the problem in deleting a problem from playlist"
        })
        
    }
}

