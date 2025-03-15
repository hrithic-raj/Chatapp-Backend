import express from 'express';
import { googleAuth, refreshToken } from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/google', googleAuth);
authRouter.post('/refresh-token', refreshToken);
export default authRouter;