import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieparser from "cookie-parser"
import userroutes from "./routes/user.routes.js"
import problemrouter from "./routes/problem.routes.js"
import executeCodeRouter from "./routes/executecode.routes.js"
import submissionRouter from "./routes/submission.routes.js"
import PlayListRouter from "./routes/playList.routes.js"
import votesRouter from "./routes/Votes.routes.js"






dotenv.config()
const port=process.env.PORT
const app=express()
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true
    })
)
app.use(express.json())
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

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
    
})