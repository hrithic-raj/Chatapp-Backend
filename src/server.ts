import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from "cors";
import mongoose from 'mongoose';
import authRouter from './routes/authRoutes';
import initializeSocket from './socket';
import chatRouter from './routes/chatRoutes';
import messageRouter from './routes/messageRoutes';
import userRouter from './routes/userRoutes';
import cookieParser from "cookie-parser";
// import { initializeSocket } from "./socket";
dotenv.config();

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

const server = http.createServer(app);
initializeSocket(server);

mongoose.connect(process.env.MONGO_URI!).then(()=>{
    console.log("MongoDB connected");
    server.listen(process.env.PORT || 5000, ()=>{
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
});