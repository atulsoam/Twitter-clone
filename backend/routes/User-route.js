import express from "express";
import { AuthMiddleWare } from "../middleWare/auth_middleware.js";
import { updateProfile,GetUserprofile, Suggesteduser,followsAndUnfollow } from "../controllers/user-controller.js";

const userRoute = express.Router();

userRoute.get("/profile/:username",AuthMiddleWare, GetUserprofile)
userRoute.get("/suggested",AuthMiddleWare, Suggesteduser)
userRoute.post("/follow/:id",AuthMiddleWare, followsAndUnfollow)
userRoute.post("/update",AuthMiddleWare, updateProfile)


export default userRoute;