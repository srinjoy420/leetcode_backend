import express from "express"
import dotenv from "dotenv"
import cookieparser from "cookie-parser"
import userroutes from "./routes/user.routes.js"
import problemrouter from "./routes/problem.routes.js"


dotenv.config()
const port=process.env.PORT
const app=express()
app.use(express.json())
app.use(cookieparser())
app.use("/api/v1/auth",userroutes)
app.use("/api/v1/problem",problemrouter)

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
    
})