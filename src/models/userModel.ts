import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    username?: string;
    profilePicture?: string;
    googleId?: string;
    refreshToken?: string;
    newUser?: boolean;
    unreadMessages: {};
}

const userSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true },
    profilePicture: { type: String },
    googleId: { type: String },
    refreshToken: { type: String },
    newUser: { type: Boolean, default: true },
    unreadMessages: { type: Map, of: Number, default: {} },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
