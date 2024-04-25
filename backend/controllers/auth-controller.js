import User from "../models/user-model.js";
import { generateToken } from "../utils/generateToken.js";

import bycrypt from "bcryptjs"

export const signup = async (req, res) => {

    try {
        const { fullname, username, email, password } = req.body

        const isEamilExist = await User.findOne({ email })
        if (isEamilExist) {
            return res.status(400).json({ error: "Email is already registered" })

        }
        const isUsernameExist = await User.findOne({ username })
        if (isUsernameExist) {
            return res.status(400).json({ error: "Username is already registered" })

        }

        const salt = await bycrypt.genSalt(10)
        const hashpassword = await bycrypt.hash(password, salt)

        const newuser = new User({
            fullname: fullname,
            username: username,
            password: hashpassword,
            email: email
        })

        if (newuser) {
            generateToken(newuser._id, res)
            await newuser.save()
            return res.status(201).json({
                _id: newuser._id,
                fullname: newuser.fullname,
                username: newuser.username,
                email: newuser.email,
                follower: newuser.follower,
                following: newuser.following,
                coverimg: newuser.coverimg,
                profilepic: newuser.profilepic,
                bio: newuser.bio

            })
        }
        else {
            return res.status(500).json({ error: "User data is not valid" })

        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message })
    }

}
export const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const isUsernameExist = await User.findOne({username})
        const isPasswordMatch = await bycrypt.compare(password, isUsernameExist?.password || "")
        if (!isPasswordMatch || !isUsernameExist){
            return res.status(400).json({
                error:"Invalid Credintatils!"
            })
        }

        generateToken(isUsernameExist._id,res)
        return res.status(200).json({
            _id: isUsernameExist._id,
            fullname: isUsernameExist.fullname,
            username: isUsernameExist.username,
            email: isUsernameExist.email,
            follower: isUsernameExist.follower,
            following: isUsernameExist.following,
            coverimg: isUsernameExist.coverimg,
            profilepic: isUsernameExist.profilepic,
            bio: isUsernameExist.bio

        })


    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message })
    }
}
export const logout = (req, res) => {

    try {
        res.cookie("jwt", "", {
            maxAge : 0,    
        })
        return res.status(200).json({
            message :"user logged out succesfully!"
        })
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error:'Internal Server Error'
        })
    }
}

export const getMe =  async (req, res)=>{
    try {
        
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error:err.message
        })
    }
}