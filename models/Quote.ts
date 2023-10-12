import mongoose from "mongoose";

export interface Quotes extends mongoose.Document {
    author: string,
    quote: string,
    nLikes: number,
    nComments: number,
}

const QuoteSchema = new mongoose.Schema<Quotes>({
    author: {
        type: String,
        required: [true, "Please provide an autohor"],
        maxlength: [60, "Author cannot be more than 60 characters"]
    },
    quote: {
        type: String,
        required: [true, "Please provide a quote"],
        maxlength: [1000, "Quote cannot be longer than 1000 characters"]
    },
})

export default mongoose.models.Quotes || mongoose.model<Quotes>("Quotes", QuoteSchema)
