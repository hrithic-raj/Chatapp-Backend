import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export const Friend = mongoose.model("friend", friendSchema);