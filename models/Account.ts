import mongoose from "mongoose";

export interface Accounts extends mongoose.Document{
    username: string,
    bio: string,
    email: string,
    password: string,
    profilePic: string,
    isActivated: boolean,
    registerDate: Date, 
}

const AccountSchema = new mongoose.Schema<Accounts>({
    username: {
        type: String,
        required: true,
        maxlength: 30
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
        required: true,
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
    }
})

export default mongoose.models.Accounts || mongoose.model<Accounts>("Accounts", AccountSchema)