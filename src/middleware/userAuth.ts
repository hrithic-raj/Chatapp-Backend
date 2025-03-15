import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import dotenv from 'dotenv';
import CustomError from "../utils/customErrorHandler";
dotenv.config();

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return next(new CustomError("Access denied, token missing!", 401));

    const JWT_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET!;
    if (!JWT_SECRET_KEY) return next(new CustomError("Key missing!", 400));

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
        const user = await User.findById(decoded.id);
        if (!user) return next(new CustomError("Access Forbidden", 403));
        req.user = user as IUser;
        next();
    } catch (error) {
        next(new CustomError("Invalid token found", 401));
    }
};
