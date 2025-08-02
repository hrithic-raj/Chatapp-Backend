import express from "express";
import { 
    searchUsers, 
    setUsername, 
    getUserProfile 
} from "../controllers/userController";
import { userAuth } from "../middleware/userAuth";

const userRouter = express.Router();

userRouter.get("/search", userAuth, searchUsers);
userRouter.post("/username", userAuth, setUsername);
userRouter.get("/profile", userAuth, getUserProfile);

export default userRouter;
