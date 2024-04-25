import express from "express"

import { signup, login,logout,getMe } from "../controllers/auth-controller.js"

import { AuthMiddleWare } from "../middleWare/auth_middleware.js"

const authrouter = express.Router()

authrouter.post("/signup",signup)

authrouter.post("/login",login)

authrouter.post("/logout",logout)
authrouter.get("/getme",AuthMiddleWare,getMe)

export default authrouter
