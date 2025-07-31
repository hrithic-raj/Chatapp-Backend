import express from "express";
import { getUserProfile, searchUsers } from "../controllers/userController";
import { userAuth } from "../middleware/userAuth";

const userRouter = express.Router();

userRouter.get("/search", userAuth, searchUsers);
userRouter.get("/", userAuth, getUserProfile);

export default userRouter;
