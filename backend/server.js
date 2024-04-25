import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authrouter from "./routes/auth-routes.js"
import connectMongodb from "./db/connect_mongo_db.js"

dotenv.config();

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use("/api/auth",authrouter)

app.listen(5000,()=>{
    console.log("server is listining at 5000");
    connectMongodb()
})