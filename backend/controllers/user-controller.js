import Notification from "../models/Notification_model.js";
import User from "../models/user-model.js";
import bcrypt from "bcryptjs"
import {v2 as cloudinary} from 'cloudinary';


export const GetUserprofile = async (req, res) => {

    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password")
        if (!user) {
            return res.status(400).json({
                error: "No user found!"
            })
        }
        return res.status(200).json(user)

    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error: err.message
        })
    }

}
export const Suggesteduser = async (req, res) => {

    try {
        const userId = req.user._id

        const UserFollowedByMe = await User.findById(userId).select("following")
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            { $sample: { size: 10 } }
        ])

        const filtereduser = users.filter(user => !UserFollowedByMe.following.includes(user._id))

        const Suggestedusers = filtereduser.slice(0, 4)
        Suggestedusers.forEach((user) => (user.password = null))

        return res.status(200).json(Suggestedusers)

    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error: err.message
        })
    }

}
export const followsAndUnfollow = async (req, res) => {

    const { id } = req.params;

    try {
        const userToModify = await User.findById(id)
        const Currentuser = await User.findById(req.user._id)

        if (id === req.user._id.toString()) {
            return res.status(400).json({
                error: "You can not follow yourself"
            })
        }

        if (!userToModify || !Currentuser) {
            return res.status(400).json({
                error: "User didn't found"
            })
        }
        const isFollowing = Currentuser.following.includes(id)

        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { follower: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
            res.status(200).json({
                message: "user Unfollowed succesfully"
            })
        }
        else {
            await User.findByIdAndUpdate(id, { $push: { follower: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
            const newNotification = await new Notification({
                type: "follow",
                from: req.user._id,
                to: id
            })

            await newNotification.save();
            res.status(200).json({
                message: "user followed succesfully"
            })
        }


    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error: err.message
        })
    }

}
export const updateProfile = async (req, res) => {

    try {
        const {fullname, username, currentpassword, newpassword,email,bio,link} = req.body
        let {profilepic, coverimg} = req.body;
        const userId = req.user._id

        let user = await User.findById(userId)

        if (!user){
            return res.status(400).json({
                error:"User not found"
            })
        }

        if ((!newpassword && currentpassword) || (!currentpassword && newpassword)){
            return res.status(400).json({
                error:"Please enter new and current password"
            })
        }
        if (newpassword && currentpassword){
            const isMatch = await bcrypt.compare(currentpassword, user.password)

            if (!isMatch){
                return res.status(400).json({
                    error:"Entered password is not correct!"
                })
            }
            const salt = await bcrypt.genSalt(10)
            user.password =  await bcrypt.hash(newpassword,salt)
        }

        if (profilepic){
            if (user.profilepic){
                await cloudinary.uploader.destroy(user.profilepic.split("/").pop().split(".")[0])
            }
            const uplaodprofile = await cloudinary.uploader.upload(profilepic)
            profilepic = uplaodprofile.secure_url
        }

        if(coverimg){
            if (user.coverimg){
                await cloudinary.uploader.destroy(user.coverimg.split("/").pop().split(".")[0])
            }
            const uplaodcover = await cloudinary.uploader.upload(coverimg)
            coverimg = uplaodcover.secure_url
        }

        user.fullname = fullname || user.fullname
        user.username = username || user.username
        user.bio = bio || user.bio
        user.email = email|| user.email
        user.link = link || user.link
        user.profilepic = profilepic || user.profilepic
        user.coverimg = coverimg || user.coverimg

        user = await user.save()

        user.password = null

        res.status(200).json(user)
    } catch (err) {

        console.log(err.message);
        return res.status(400).json({
            error: err.message
        })
    }

}