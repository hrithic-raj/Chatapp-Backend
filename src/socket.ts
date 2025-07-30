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

        // Chat creation handler
        socket.on("createChat", async ({ user1, user2 }) => {
            const existingChat = await Chat.findOne({
                users: { $all: [user1, user2] }
            });
            
            if (!existingChat) {
                const newChat = await Chat.create({
                    users: [user1, user2],
                    createdBy: user1
                });
                
                // Emit to both users
                io.to(user1).to(user2).emit("newChat", newChat);
            }
        });

        // Read receipt handler
        socket.on("markMessagesAsRead", async ({ chatId, userId }) => {
            await Message.updateMany(
                { chat: chatId, sender: { $ne: userId }, read: false },
                { $set: { read: true } }
            );
            
            // Update unread count
            await User.findByIdAndUpdate(userId, {
                $unset: { [`unreadMessages.${chatId}`]: 1 }
            });
            
            // Notify other participants
            const chat = await Chat.findById(chatId);
            chat?.users.forEach(user => {
                if (user.toString() !== userId) {
                    io.to(user.toString()).emit("messagesRead", { chatId, userId });
                }
            });
        });

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
            const populatedMessage = await message.populate("sender", "name email profilePicture");
            // Emit to all sockets in the room
            io.to(chatId).emit("receiveMessage", populatedMessage);
        });


        socket.on("disconnect", ()=>{
            console.log(`User Disconnected: ${socket.id}`);
        });
    });

    return io;
}

export default initializeSocket;
