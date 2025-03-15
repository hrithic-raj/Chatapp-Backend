import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { Chat } from "../models/chatModel";
import { Message } from "../models/messageModel";
import User from "../models/userModel";

export const sendMessage = catchAsync(async (req: Request, res:Response)=>{
    const { chatId, content } = req.body;
    const senderId = req.user._id;

    const message = await Message.create({chat: chatId, sender: senderId, content});
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id});

    const chat = await Chat.findById(chatId);
    const receiverId = chat?.users.find((id)=>id.toString()!==senderId);
    if (receiverId) {
        await User.findByIdAndUpdate(receiverId, { $inc: { [`unreadMessages.${chatId}`]: 1 } });
    }

    res.status(200).json(message);
});

export const fetchMessages = catchAsync(async (req: Request, res:Response)=>{
    const {chatId} = req.params;
    
    const message = await Message.find({chat: chatId})
        .populate("sender", "name email profilePicture")
        .sort({ createdAt: 1 });

    res.status(200).json(message);
});

export const markAsRead = catchAsync(async (req: Request, res:Response)=>{
    const {chatId} = req.params;

    await Message.updateMany({chat: chatId, read: false}, {read: true});
    await User.findByIdAndUpdate(req.user._id, {$set: {[`unreadMessages.${chatId}`]: 0}});

    res.status(200).json({success: true});
});