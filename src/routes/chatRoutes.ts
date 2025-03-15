import express from "express";
import { getUserChats, createChat, getChatById } from "../controllers/chatController";
import { userAuth } from "../middleware/userAuth";

const chatRouter = express.Router();

chatRouter.get("/", userAuth, getUserChats);
chatRouter.post("/", userAuth, createChat);
chatRouter.get("/:chatId", userAuth, getChatById);

export default chatRouter;
