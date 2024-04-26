import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import {v2 as cloudinary} from 'cloudinary';
import authrouter from "./routes/auth-routes.js"
import userRoute from "./routes/User-route.js"
import postroutes from "./routes/post_routes.js";
import connectMongodb from "./db/connect_mongo_db.js"

dotenv.config();

          
cloudinary.config({ 
  cloud_name: process.env.clodnary_name, 
  api_key: process.env.clodnary_key, 
  api_secret: process.env. clodnary_secerat
});

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use("/api/auth",authrouter)
app.use("/api/users",userRoute)
app.use("/api/post",postroutes)


app.listen(5000,()=>{
    console.log("server is listining at 5000");
    connectMongodb()
})