import express from "express"
import path from "path"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import {v2 as cloudinary} from 'cloudinary';

import authrouter from "./routes/auth-routes.js"
import userRoute from "./routes/User-route.js"
import postroutes from "./routes/post_routes.js";
import NotificationRoutes from "./routes/notification_routes.js";

import connectMongodb from "./db/connect_mongo_db.js"

dotenv.config();

          
cloudinary.config({ 
  cloud_name: process.env.clodnary_name, 
  api_key: process.env.clodnary_key, 
  api_secret: process.env. clodnary_secerat
});

const app = express()

const __dirname = path.resolve()

app.use(express.json({limit:"5mb"}))

app.use(cookieParser())

app.use("/api/auth",authrouter)
app.use("/api/users",userRoute)
app.use("/api/post",postroutes)
app.use("/api/notification",NotificationRoutes)

app.use(express.static(path.join(__dirname,"/frontend/dist")))
app.get("*", (req,res)=>{
  res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
})



app.listen(5000,()=>{
    console.log("server is listining at 5000");
    connectMongodb()
})