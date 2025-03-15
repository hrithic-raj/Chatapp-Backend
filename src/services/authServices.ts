import CustomError from "../utils/customErrorHandler";
import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv';
import axios from "axios";
import User from "../models/userModel";
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from "../utils/jwtTokenGenerator";
import { Response } from "express";

dotenv.config();

export interface CredentialResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    authuser?: string;
    prompt?: string;
}

export const googleAuthService = async(res: Response, credentialResponse : CredentialResponse)=>{
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    if (!credentialResponse) {
        throw new CustomError("No google credentials provided!", 400);
    }

    const googleUser = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${credentialResponse.access_token}` },
        }
    );

    const { email, name, picture, id:googleId } = googleUser.data;

    let user = await User.findOne({ email });
    let accessToken, refreshToken, newUser;
    
    if(!user){
        user = new User({ name, email, profilePicture: picture, googleId})
        await user.save();
        accessToken = generateAccessToken({ id: user._id});
        refreshToken = generateRefreshToken({ id: user._id});
        user.refreshToken = refreshToken;
        await user.save();
        newUser = true;
    }else{
        accessToken = generateAccessToken({ id: user._id});
        refreshToken = generateRefreshToken({ id: user._id});
        user.refreshToken = refreshToken;
        await user.save();
        newUser = false;
    }
    if(!user) throw new CustomError("Google Auth faild !", 400);
    return {
        user,
        accessToken,
        refreshToken,
        newUser,
    }
}


export const refreshTokenService = async(refreshToken: string)=>{
    const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    const user = await User.findById(decoded.id);
    if(!user || user.refreshToken != refreshToken) throw new CustomError('Invalid refresh token', 403);
    const newAccessToken = generateAccessToken({ id: user._id });
    return newAccessToken;
}