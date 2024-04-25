import mongoose from "mongoose";


const NotificationSchemsa = new mongoose.Schema({
    from: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user",    
    },
    to: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user",
    },
    type: {
        type: String,
        required: true,
        enum:["follow","like"]
    },
    read: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })


const Notification = mongoose.model("Notification",NotificationSchemsa)

export default Notification;