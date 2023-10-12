import mongoose from "mongoose";

export interface Comments extends mongoose.Document {
    postId: mongoose.Schema.Types.ObjectId, ref: "Account",
    postTime: Date,
    text: string,
    author: {
        profilePic: string,
        username: string
    }
}

const CommentSchema = new mongoose.Schema<Comments>({
    postId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Account",
        required: true
    },
    postTime: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required: true,
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

export default mongoose.models.Comments || mongoose.model<Comments>("Comments", CommentSchema)