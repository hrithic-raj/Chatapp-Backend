import express from "express";
import { searchUsers } from "../controllers/userController";
import { userAuth } from "../middleware/userAuth";

const userRouter = express.Router();

userRouter.get("/search", userAuth, searchUsers);

export default userRouter;
