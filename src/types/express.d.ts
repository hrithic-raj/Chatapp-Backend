import { User } from "../models/userModel";
import { File } from "../types/multer";

declare module "express" {
  export interface Request {
    user?: User;
    file?: File;
  }
}

export interface AuthenticatedRequest extends Request {
  user: User;
}
