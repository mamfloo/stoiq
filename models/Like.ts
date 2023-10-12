import mongoose, { Schema } from "mongoose";

export interface Likes extends mongoose.Document {
    referenceId: string,  //post or comment
    likeTime: Date,
    author: {
        profilePic: string,
        username: string
    }
}

const LikeSchema = new mongoose.Schema<Likes>({
    referenceId: {
        type: String,
        required: true
    },
    likeTime: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: {
            profilePic: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            }
        },
        required: true
    }
})

export default mongoose.models.Likes || mongoose.model<Likes>("Likes", LikeSchema)