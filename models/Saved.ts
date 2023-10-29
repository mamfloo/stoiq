import mongoose from "mongoose";

export interface Saved extends mongoose.Document {
    referenceId: string,
    saveTime: Date,
    accountId: string,
    type: string
}

const SavedSchema = new mongoose.Schema<Saved>({
    referenceId: {
        type: String,
        required: true
    },
    saveTime: {
        type: Date,
        default: Date.now,
    },
    accountId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

export default mongoose.models.Saved || mongoose.model<Saved>("Saved", SavedSchema);