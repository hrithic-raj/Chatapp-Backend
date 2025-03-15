import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    read: { type: Boolean, default: false },
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
