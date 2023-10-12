import mongoose from "mongoose";

export interface Posts extends mongoose.Document {
    text: string,
    postTime: Date,
    nLikes: number,
    nComments: number,
    author: {
        profilePic: string,
        username: string
    }
}

const PostSchema = new mongoose.Schema<Posts>({
    text: {
        type: String,
        required: true,
        maxlength: 1000
    },
    postTime: {
        type: Date,
        default: Date.now
    },
    nLikes: {
        type: Number
    },
    nComments: {
        type: Number
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

export default mongoose.models.Posts || mongoose.model<Posts>("Posts", PostSchema)
