import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
import cloudinary from "../utils/cloudinaryConfig";
// import { AuthenticatedRequest } from "../types/express";

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

export const updateProfile = catchAsync(async (req , res: Response) => {
    const { name, username } = req.body;
    const user = await User.findById(req.user?._id);
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Handle image upload
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'chat-app/profiles',
            width: 500,
            crop: 'scale'
        });
        user.profilePicture = result.secure_url;
    }

    // Update user fields
    user.name = name || user.name;
    user.username = username || user.username;

    await user.save();

    res.status(200).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture
    });
});
