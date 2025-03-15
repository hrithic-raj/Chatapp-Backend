import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";

export const searchUsers = catchAsync(async (req: Request, res:Response)=>{
    const {query} = req.query;
    if(!query) return res.json([]);
    
    const userId = req.user?._id

    const users = await User.find({ 
        name: new RegExp(query as string, "i"),
        _id: { $ne: userId }
    }).select("_id name profilePicture");

    res.json(users);
});