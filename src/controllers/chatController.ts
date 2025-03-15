import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { Chat } from "../models/chatModel";
import CustomError from "../utils/customErrorHandler";

export const getUserChats = catchAsync(async (req: Request, res:Response)=>{
    const userId = req.user._id;
    const chats = await Chat.find({users: userId})
    .populate("users","_id name profilePicture")
    .populate("lastMessage");

    res.status(200).json(chats);
});

export const getChatById = catchAsync(async (req: Request, res:Response)=>{
    const {chatId} = req.params;

    const chat = await Chat.findById(chatId)
    .populate("users","_id name email profilePicture")
    .populate("lastMessage");

    if (!chat) throw new CustomError("no chat found", 404);
    
    res.status(200).json(chat);
});

export const createChat = catchAsync(async (req: Request, res: Response)=>{
    const {userId} = req.body;
    const currentUserId = req.user._id;

    if(!userId) throw new CustomError("UserId required", 400);

    let chat = await Chat.findOne({
        users: {$all: [currentUserId, userId]}
    }).populate("users").populate("lastMessage");

    if(chat) return res.status(200).json(chat);

    chat = await Chat.create({
        users: [currentUserId, userId]
    });

    const fullChat = await Chat.findById(chat._id).populate("users");

    res.status(201).json(fullChat);
})