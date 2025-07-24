import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import dotenv from 'dotenv';
import { Message } from "./models/messageModel";
import { Chat } from "./models/chatModel";
import User from "./models/userModel";

dotenv.config();

const initializeSocket = (server: HttpServer)=>{
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    
    io.on("connection", (socket)=>{
        console.log(`User Connected: ${socket.id}`);
        
        socket.on("joinChat", (chatId)=>{
            socket.join(chatId);
        });

        // socket.on("sendMessage", (message)=>{
        //     console.log("frontmsg", message)
        //     // io.to(message.chatId).emit("receiveMessage", message);
        // });

        socket.on("sendMessage", async (messageData) => {
            const { chatId, content, sender } = messageData;

            // Save message to DB
            const message = await Message.create({
                chat: chatId,
                sender: sender,
                content,
            });

            // Update last message in chat
            await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

            // Update unread count
            const chat = await Chat.findById(chatId);
            const receiverId = chat?.users.find((id) => id.toString() !== sender);
            if (receiverId) {
                await User.findByIdAndUpdate(receiverId, {
                    $inc: { [`unreadMessages.${chatId}`]: 1 },
                });
            }

            // Emit to all sockets in the room
            io.to(chatId).emit("receiveMessage", message);
        });


        socket.on("disconnect", ()=>{
            console.log(`User Disconnected: ${socket.id}`);
        });
    });

    return io;
}

export default initializeSocket;