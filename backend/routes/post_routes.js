import express from "express";
import { AuthMiddleWare } from "../middleWare/auth_middleware.js";
import { createPost, likeunlikePost,commentPost,deletPost,getAllPost,getLikedPost,getFollowingPost,getuserPsot } from "../controllers/post-controller.js";

const postroutes = express.Router();

postroutes.post("/create",AuthMiddleWare, createPost)
postroutes.post("/allpost",AuthMiddleWare, getAllPost)
postroutes.post("/following",AuthMiddleWare, getFollowingPost)
postroutes.post("/Liked/:id",AuthMiddleWare, getLikedPost)
postroutes.post("/userpost/:username",AuthMiddleWare, getuserPsot)

postroutes.post("/like/:id",AuthMiddleWare, likeunlikePost)
postroutes.post("/comment/:id",AuthMiddleWare, commentPost)
postroutes.delete("/:id",AuthMiddleWare, deletPost)



export default postroutes;