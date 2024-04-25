import User from "../models/user-model.js";
import jwt from "jsonwebtoken"

export const AuthMiddleWare = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(400).json({
                error:"Unauthorized : No token found"
            })
        }
        const decode = jwt.verify(token,process.env.JWTTOKEN)

        if (!decode){
            return res.status(400).json({
                error:"Unauthorized : Invalid Token"
            })
        }
        const user = await User.findById(decode.UserID).select("-password")

        if (!user){
            return res.status(400).json({
                error:"Unauthorized : user not found"
            })
        }

        req.user = user;
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error:err.message
        })
    }
}