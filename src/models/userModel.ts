import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    username: string;
    profilePicture?: string;
    googleId?: string;
    refreshToken?: string;
    unreadMessages:{};
}

const userSchema: Schema<IUser> = new Schema({
    name:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    username:{type:String, unique:true},
    profilePicture:{type:String},
    googleId:{type:String},
    refreshToken:{type: String},
    unreadMessages: { type: Map, of: Number, default: {} },
});

const User = mongoose.model <IUser> ('User',userSchema);
export default User;