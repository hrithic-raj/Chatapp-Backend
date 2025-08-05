import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
import { googleAuthService, refreshTokenService } from "../services/authServices";
import { cookieSaver } from "../utils/jwtTokenGenerator";
import CustomError from "../utils/customErrorHandler";

export const googleAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { credentialResponse } = req.body;
    const { user, accessToken, refreshToken, newUser } = await googleAuthService(res, credentialResponse);
    cookieSaver(res, refreshToken);
    
    res.status(200).json({
        status: "success",
        message: "Login successful via Google",
        user: { ...user.toObject(), newUser },
        accessToken,
        refreshToken,
        newUser
    });
});

export const verifyToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const user = await User.findById(userId).select("_id name username email profilePicture newUser");

  console.log("user Found in verifyToken", user);
  
  if (!user) {
    return next(new CustomError('Invalid or expired token', 401));
  }

  res.status(200).json({
    status: "success",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      newUser: user.newUser
    }
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return next(new CustomError('Refresh token required', 401));
    }
    const { newAccessToken, user } = await refreshTokenService(refreshToken);
    cookieSaver(res, refreshToken);
    res.status(200).json({
        status: "success",
        message: "New AccessToken created",
        newAccessToken,
        user
    });
});
