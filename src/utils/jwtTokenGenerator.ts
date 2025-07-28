import jwt from 'jsonwebtoken';
import { Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '5m' });
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload,  process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
};

export const cookieSaver = (res: Response, refreshToken: string)=>{
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // Only works if you're using HTTPS
        sameSite: 'lax', // For cross-site requests
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

// export const clearCookie = (res: Response)=>{
//     res.clearCookie('refreshToken',{
//         httpOnly: true,
//         secure: true,
//         sameSite: 'none',
//     });
// }