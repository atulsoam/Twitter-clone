import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    text: {
        type: String,
    },
    img: {
        type: String,

    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
    ],
    coments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true
            }
        }
    ]
}, { timestamps: true })


const Post = mongoose.model("Post", PostSchema)

export default Post;