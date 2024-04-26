import Notification from "../models/Notification_model.js";

export const AllNotification = async (req,res)=>{

    try {

        const UserId = req.user._id

        const notification = await Notification.find({to:UserId}).sort({createdAt:-1}).populate({
            path:"from",
            select:"username profilepic"
        })

        await Notification.updateMany({to:UserId},{read:true})

        res.status(200).json(notification)
        
    } catch (err) {
        console.log(err.message);
        return res.status(200).json({
            error:err.message
        })
    }

}

export const deletNotification = async (req,res)=>{
    try {

        const UserId = req.user._id

       

        await Notification.deleteMany({to:UserId})

        res.status(200).json({
            message:"Notification deleted"
        })
        
    } catch (err) {
        console.log(err.message);
        return res.status(200).json({
            error:err.message
        })
    }

}