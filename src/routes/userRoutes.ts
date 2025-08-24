import express from "express";
import { 
    searchUsers, 
    setUsername, 
    getUserProfile,
    updateProfile
} from "../controllers/userController";
import { userAuth } from "../middleware/userAuth";
import multer from "multer";

const userRouter = express.Router();
const upload = multer();

userRouter.get("/search", userAuth, searchUsers);
userRouter.post("/username", userAuth, setUsername);
userRouter.get("/profile", userAuth, getUserProfile);
userRouter.put("/profile", userAuth, upload.single('profilePicture'), updateProfile);

export default userRouter;
