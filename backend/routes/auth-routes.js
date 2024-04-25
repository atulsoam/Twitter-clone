import express from "express"

import { signup, login,logout } from "../controllers/auth-controller.js"

const authrouter = express.Router()

authrouter.get("/signup",signup)

authrouter.get("/login",login)


authrouter.get("/logout",logout)

export default authrouter
