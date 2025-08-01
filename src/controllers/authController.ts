import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
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
