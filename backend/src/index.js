import "./config/env.js"
import { isCloudinaryConfigured, verifyCloudinaryCredentials } from "./lib/Cloudnary.js"
import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
import userroutes from "./routes/user.routes.js"
import problemrouter from "./routes/problem.routes.js"
import executeCodeRouter from "./routes/executecode.routes.js"
import submissionRouter from "./routes/submission.routes.js"
import PlayListRouter from "./routes/playList.routes.js"
import votesRouter from "./routes/Votes.routes.js"






const port=process.env.PORT
const app=express()
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true
    })
)
app.use(express.json({limit:'50mb'}))
app.use(cookieparser())
app.use("/api/v1/auth",userroutes)
app.use("/api/v1/problem",problemrouter)
app.use("/api/v1/executecode",executeCodeRouter)
app.use("/api/v1/submission",submissionRouter)
app.use("/api/v1/playlist",PlayListRouter)
app.use("/api/v1/votes",votesRouter)

app.get("/",(req,res)=>{
    res.send("hello")
})

app.listen(port, async () => {
    console.log(`server is running on ${port}`)

    if (!isCloudinaryConfigured) {
        console.warn("[Cloudinary] NOT configured — profile picture upload will fail")
        return
    }

    const check = await verifyCloudinaryCredentials()
    if (check.ok) {
        console.log("[Cloudinary] credentials OK (upload permission verified)")
    } else {
        console.warn(`[Cloudinary] ${check.reason}: ${check.detail}`)
    }
})