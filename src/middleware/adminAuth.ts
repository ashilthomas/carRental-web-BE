import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import UserModel, { IUser } from '../model/userModel';
import dotenv from 'dotenv';

dotenv.config();

declare global {
    namespace Express {
      interface Request {
        user?:IUser; 
      }
    }
  }
  
const SECRET_KEY = process.env.JWT_SECRET as string;

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization;
    
    
    

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    try {
        // Decode token to extract user data
        const decoded = jwt.verify(token, SECRET_KEY) as IUser;
        req.user = decoded ; 

        // Fetch the user from the database
        const admin = await UserModel.findById(req.user._id);

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ success: false, message: "Unauthorized: Admins only" });
        }

        next();
    } catch (error: any) {
        res.status(403).json({ success: false, message: error.message });
    }
};
