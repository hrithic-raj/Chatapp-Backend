import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";

export const searchUsers = catchAsync(async (req: Request, res: Response) => {
    const { query } = req.query;
    if (!query) return res.json([]);
    
    const userId = req.user?._id;

    const users = await User.find({ 
        name: new RegExp(query as string, "i"),
        _id: { $ne: userId }
    }).select("_id name profilePicture");

    res.json(users);
});

export const setUsername = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { username } = req.body;
    
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
    }

    await User.findByIdAndUpdate(userId, { 
        username,
        newUser: false 
    });
    
    res.status(200).json({ message: "Username set successfully" });
});

export const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const userData = await User.findById(userId).select("_id name username profilePicture");
    res.status(200).json(userData);
});
