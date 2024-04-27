import Notification from "../models/Notification_model.js"
import Post from "../models/post_model.js"
import User from "../models/user-model.js"
import { v2 as cloudinary } from "cloudinary"

export const createPost = async (req, res) => {

    try {

        const { text } = req.body
        let { img } = req.body

        const UserId = req.user._id.toString()

        const user = await User.findById(UserId)

        if (!user) {
            return res.status(400).json({
                error: "user not found"
            })
        }

        if (!text && !img) {
            return res.status(400).json({
                error: "Img and text should be there"
            })
        }

        if (img) {
            const Uploadresponse = await cloudinary.uploader.upload(img)
            img = Uploadresponse.secure_url
        }

        const newPost = new Post({
            user: UserId,
            text: text,
            img: img
        })

        await newPost.save()

        res.status(201).json(newPost)

    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error: err.message
        })
    }

}
export const likeunlikePost = async (req, res) => {

    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // Unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPost: postId } });

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            // Like post
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPost: postId } });
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });
            await notification.save();

            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    } catch (error) {
        console.log("Error in likeUnlikePost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }

}
export const commentPost = async (req, res) => {

    try {

        const { text } = req.body
        const postId = req.params.id
        const userId = req.user._id

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(400).json({
                error: 'Post not found'
            })
        }

        if (!text) {
            return res.status(400).json({
                error: 'Enter some comments'
            })
        }

        const comment = { user: userId, text }

        post.coments.push(comment)

        post.save()
        const updatedComments = post.coments
        res.status(201).json(
            updatedComments
        )
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error: err.message
        })
    }
}
export const deletPost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)
        console.log(req.params.id);
        if (!post) {
            return res.status(400).json({
                error: 'Post not found'
            })
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status.json({
                error: "You are not owner of this post "
            })
        }

        if (post.img) {
            const ImgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(ImgId)
        }

        await Post.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message: "Post deleted succesfully!!"
        })

    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error: err.message
        })
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "coments.user",
            select: "-password"
        })

        if (posts.length === 0) {
            res.status(200).json([])
        }

        res.status(200).json(posts)

    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error: err.message
        })
    }
}

export const getLikedPost = async (req, res) => {
    const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPost } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "coments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const getFollowingPost = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({
                error: "user not found"
            })
        }

        const following = user.following

        const FollowingPost = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "coments.user",
            select: "-password"
        })
        res.status(200).json(FollowingPost)

    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error: err.message
        })
    }
}

export const getuserPsot = async (req, res) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({
                error: "user not found"
            })
        }
        const UserPost = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "coments.user",
            select: "-password"
        })
        res.status(200).json(UserPost)

    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error: err.message
        })
    }
}