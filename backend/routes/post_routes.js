import express from "express";
import { AuthMiddleWare } from "../middleWare/auth_middleware.js";
import { createPost, likeunlikePost,commentPost,deletPost,getAllPost,getLikedPost,getFollowingPost,getuserPsot } from "../controllers/post-controller.js";

const postroutes = express.Router();

postroutes.post("/create",AuthMiddleWare, createPost)
postroutes.get("/allpost",AuthMiddleWare, getAllPost)
postroutes.get("/following",AuthMiddleWare, getFollowingPost)
postroutes.get("/Liked/:id",AuthMiddleWare, getLikedPost)
postroutes.get("/userpost/:username",AuthMiddleWare, getuserPsot)

postroutes.post("/like/:id",AuthMiddleWare, likeunlikePost)
postroutes.post("/comment/:id",AuthMiddleWare, commentPost)
postroutes.delete("/:id",AuthMiddleWare, deletPost)



export default postroutes;