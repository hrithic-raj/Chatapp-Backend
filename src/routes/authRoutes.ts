import express from 'express';
import * as authController from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/verify-token', authController.verifyRefreshToken);
authRouter.post('/google', authController.googleAuth);
authRouter.post('/refresh-token', authController.refreshToken);
export default authRouter;
