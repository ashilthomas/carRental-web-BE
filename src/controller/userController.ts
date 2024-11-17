import { Request, Response } from 'express';
import UserModel, { IUser } from '../model/userModel'; // Import IUser from userModel
import bcrypt from 'bcrypt';
import getToken from '../utils/generateToken';
interface AuthenticatedRequest extends Request {
    user?: IUser; // Explicitly specify user here
  }

  const getUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    console.log(req.body);

    if (!username || !password || !email) {
        return res.status(400).json({
            success: false,
            message: 'Username, email, and password are required',
        });
    }

    try {
        // Check if the email already exists
        const existEmail = await UserModel.findOne({ email });
        if (existEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
            });
        }

        // Hash the password
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds); // Use bcrypt.hash with salt rounds only

        // Create the new user
        const newUser = new UserModel({
            username,
            email,
            password: hash,
        });

        // Save the user to the database
        const user = await newUser.save();

        // Generate the token and send the response
        return getToken(user, res);

    } catch (error: any) {
        console.error('Error in getUser:', error);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
};

const userLogin = async (req: Request, res: Response) => {
    console.log(req.body);

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password',
        });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

       
        getToken(user, res);

    } catch (error) {
        console.error('Error in userLogin:', error);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
};
export const checkAdmin = async (req: AuthenticatedRequest, res: Response) => {

    const adminId = req.user?._id;
   
    

    if (!adminId) {
        return res.status(403).json({ message: "authentication failed", success: false });
    }

    try {
        const isAdmin = await UserModel.findById(adminId);

        if (!isAdmin || isAdmin.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized: Admins only", success: false });
        }

        res.json({ success: true, message: "Authenticated as admin" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


const checkuser = async (req: Request, res: Response) => {
    console.log("Hitting the checkuser route");

    const userId = req.user?._id;

    if (!userId) {
        return res.json({ success: false, message: "User not authenticated" });
    }

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "User authenticated successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error" });
    }
};


  export const getAllUser = async (req: Request, res: Response) => {
    try {
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
  
     
      const skip = (page - 1) * limit;
  
    
      const users = await UserModel.find({})
        .skip(skip)
        .limit(limit);
  
      // Count total users for pagination info
      const totalUsers = await UserModel.countDocuments();
  
      // Check if users were found
      if (!users || users.length === 0) {
        return res.json({
          success: false,
          message: 'No users found',
        });
      }
  
      // Return paginated users along with pagination info
      res.json({
        success: true,
        users,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      });
    } catch (error: any) {
      console.error(error);
      res.json({
        success: false,
        message: error.message,
      });
    }
  };
export { getUser,userLogin,checkuser };
