import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import dotenv from 'dotenv';

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

        socket.on("sendMessage", (message)=>{
            console.log("frontmsg", message)
            // io.to(message.chatId).emit("receiveMessage", message);
        });

        socket.on("disconnect", ()=>{
            console.log(`User Disconnected: ${socket.id}`);
        });
    });

    return io;
}

export default initializeSocket;