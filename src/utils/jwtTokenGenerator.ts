import jwt from 'jsonwebtoken';
import { Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1m' });
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload,  process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
};

export const cookieSaver = (res: Response, refreshToken: string) => {
  res.cookie('chat_refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: '.filmista.online',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// export const cookieSaver = (res: Response, refreshToken: string)=>{
//     res.cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: 'lax',
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
// }

// export const clearCookie = (res: Response)=>{
//     res.clearCookie('refreshToken',{
//         httpOnly: true,
//         secure: true,
//         sameSite: 'none',
//     });
// }