import mongoose from "mongoose";

export interface Likes extends mongoose.Document {
    referenceId: string,  //post or comment
    likeTime: Date,
    accountId: string
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
    accountId: {
        type: String,
        required: true
    }
})

export default mongoose.models.Likes || mongoose.model<Likes>("Likes", LikeSchema)