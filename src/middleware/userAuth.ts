import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { IUser } from '../model/userModel';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET as string;

const userAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve the token from the cookies
       
        const token = req.cookies.token || req.headers.authorization;
        console.log(token);
        

        // If token doesn't exist, return unauthorized
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed. No token provided.",
            });
        }

   
        const decoded = jwt.verify(token, SECRET_KEY) as IUser;

    
        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed. Token has expired.",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Authentication failed. Invalid token.",
        });
    }
};

export default userAuth;
