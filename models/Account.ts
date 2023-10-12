import mongoose from "mongoose";

export interface Accounts extends mongoose.Document{
    username: string,
    email: string,
    password: string,
    profilePic: string,
    isActivated: boolean 
}

const AccountSchema = new mongoose.Schema<Accounts>({
    username: {
        type: String,
        required: true,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
        maxlength: 30
    },
    isActivated: {
        type: Boolean
    }
})

export default mongoose.models.Accounts || mongoose.model<Accounts>("Accounts", AccountSchema)