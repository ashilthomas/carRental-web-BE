import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../model/userModel'; // Import IUser interface from userModel


export interface ITokenPayload {
    _id: string; // Store _id as a string in the token payload
    username: string;
    email: string;
    role?: string;
}

const SECRET_KEY = process.env.JWT_SECRET as string;

const getToken = (user:IUser , res: Response) => {
    try {
        if (!SECRET_KEY) {
            throw new Error("Secret key is missing");
        }

        const payload: ITokenPayload = {
            _id: user._id.toString(), // Convert ObjectId to string for the token
            username: user.username,
            email: user.email,
            role: user.role,
        };



        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "30m" });

        
        res.status(200)
            .cookie("token", token,{
             
            })
            .json({
                success: true,
                user: payload,
                token,
                message: "Logged in successfully",
            });

        // Send cookie and response together
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     maxAge: 30 * 60 * 1000, // 30 minutes
        // });

        // Send response after setting the cookie
        // return res.status(200).json({
        //     success: true,
        //     user: payload,
        //     token,
        //     message: "Logged in successfully",
        // });
    } catch (error: any) {
        // If an error occurs, ensure no headers have been sent yet
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Token generation failed",
                error: error.message,
            });
        }
    }
};

export default getToken;
