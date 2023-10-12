import mongoose from "mongoose";

export interface Saved extends mongoose.Document {
    referenceId: string,
    accountId: string
}

const SavedSchema = new mongoose.Schema<Saved>({
    referenceId: {
        type: String,
        required: true
    },
    accountId: {
        type: String,
        required: true
    }
})

export default mongoose.models.Saved || mongoose.model<Saved>("Saved", SavedSchema);