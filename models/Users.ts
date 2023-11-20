import { randomUUID } from "crypto";
import mongoose from "mongoose";

export interface Users extends mongoose.Document{
    name: string,
    image: string
    username: string,
    bio: string,
    email: string,
    password: string,
    profilePic: string,
    isActivated: boolean,
    registerDate: Date,
    quotePage: number 
}

const UserSchema = new mongoose.Schema<Users>({
    name: {
        type: String,
    },
    image: {
        type: String
    },
    username: {
        type: String,
        required: true,
        maxlength: 20,
        default: Math.random().toString(36).substring(2,15)
    },
    bio: {
        type: String,
        required: true,
        maxlength: 100,
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
        default: "default.png"
    },
    isActivated: {
        type: Boolean,
        required: true,
        default: true
    },
    registerDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    quotePage: {
        type: Number,
        required: true,
        default: 0
    }
})

export default mongoose.models.Users || mongoose.model<Users>("Users", UserSchema)