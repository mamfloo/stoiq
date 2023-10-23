import mongoose from "mongoose";

export interface Comments extends mongoose.Document {
    postId: mongoose.Schema.Types.ObjectId, ref: "Account",
    postTime: Date,
    text: string,
    nLikes: number,
    nComments: number,
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
    nLikes: {
        type: Number,
        required: true,
        default: 0
    },
    nComments: {
        type: Number,
        required: true,
        default: 0
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