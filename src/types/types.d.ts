// src/types.d.ts
import { IUser } from '../model/userModel';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?:IUser; // Define `user` on the request object as an optional type IUser
    }
  }
}

declare module 'express';
declare module 'cors';
declare module 'cookie-parser';
declare module 'jsonwebtoken';
declare module 'bcrypt';
declare module 'multer';
