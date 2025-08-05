import express from 'express';
import * as authController from '../controllers/authController';
import { userAuth } from '../middleware/userAuth';

const authRouter = express.Router();

authRouter.post('/verify-token', userAuth, authController.verifyToken);
authRouter.post('/google', authController.googleAuth);
authRouter.post('/refresh-token', authController.refreshToken);
export default authRouter;
