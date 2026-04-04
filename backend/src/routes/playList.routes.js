import {Router} from "express"
import { addProblemtoPlaylist, createPlaylist, deletePlaylist, deleteProblemFromPlayList, getallPlaylist, getPlaylistById } from "../controller/playList.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const PlayListRouter=Router()
PlayListRouter.post("/create",authMiddleware,createPlaylist)
PlayListRouter.get("/getall-playlist",authMiddleware,getallPlaylist)
PlayListRouter.get("/:playlistId",authMiddleware,getPlaylistById)
PlayListRouter.post("/:playlistId/add-problem",authMiddleware,addProblemtoPlaylist)
PlayListRouter.delete("/delete/:playlistId",authMiddleware,deletePlaylist)
PlayListRouter.delete("/:playlistId/delete-problem",authMiddleware,deleteProblemFromPlayList)


export default PlayListRouter
