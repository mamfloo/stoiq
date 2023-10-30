import mongoose from "mongoose";

export interface Accounts extends mongoose.Document{
    username: string,
    bio: string,
    email: string,
    password: string,
    profilePic: string,
    isActivated: boolean,
    registerDate: Date,
    quotePage: number 
}

const AccountSchema = new mongoose.Schema<Accounts>({
    username: {
        type: String,
        required: true,
        maxlength: 30,
    },
    bio: {
        type: String,
        required: true,
        maxlength: 500,
        default: ""
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
    },
    password: {
        type: String,
    },
    profilePic: {
        type: String,
        required: true,
    },
    isActivated: {
        type: Boolean,
        required: true
    },
    registerDate: {
        type: Date,
        required: true
    },
    quotePage: {
        type: Number,
        required: true,
        default: 0
    }
})

export default mongoose.models.Accounts || mongoose.model<Accounts>("Accounts", AccountSchema)