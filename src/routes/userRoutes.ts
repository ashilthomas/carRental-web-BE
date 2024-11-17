import express from 'express';
import { checkAdmin, checkuser, getAllUser, getUser, userLogin } from '../controller/userController';
import { authenticateAdmin } from '../middleware/adminAuth';
import userAuth from '../middleware/userAuth';

const userRoutes = express.Router();

// User registration route
userRoutes.post("/register", getUser);
userRoutes.post("/login", userLogin);
userRoutes.post("/checkadmin",authenticateAdmin,checkAdmin)
userRoutes.get("/checkuser",userAuth,checkuser)
userRoutes.get("/alluser",getAllUser)

export default userRoutes;
