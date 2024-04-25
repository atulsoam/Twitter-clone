import mongoose from "mongoose"
const connectMongodb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MongoDb_URI)
        console.log("mongodb connected");
    } catch (error) {
        console.log(error.message);
    }

}

export default connectMongodb;