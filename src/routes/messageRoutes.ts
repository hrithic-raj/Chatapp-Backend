import express from "express";
import { fetchMessages, sendMessage, markAsRead } from "../controllers/messageController";
import { userAuth } from "../middleware/userAuth";

const messageRouter = express.Router();

messageRouter.get("/:chatId", userAuth, fetchMessages);
messageRouter.post("/", userAuth, sendMessage);
messageRouter.post("/read/:chatId", userAuth, markAsRead);

export default messageRouter;