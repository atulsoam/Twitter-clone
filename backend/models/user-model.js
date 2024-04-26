import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    follower :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            default:[]
        }
    ],
    following :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            default:[]
        }
    ],
    profilepic:{
        type:String,
        default:""
    },
    coverimg:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    link:{
        type:String,
        default:""
    },
    likedPost:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
            default:[]
        }
    ]
}, { timestamps: true })


const User = mongoose.model("user",UserSchema)

export default User;