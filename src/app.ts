import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db';
import userRoutes from './routes/userRoutes';
import vechicleRoutes from './routes/vechicleRoute';
import bookingRoutes from './routes/bookingRoutes';
import cookieParser from "cookie-parser"




dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

// Connect to the database
connectDb()
// Routes
app.use("/api/v1/adduser", userRoutes);
app.use("/api/v1/vechicle", vechicleRoutes);
app.use("/api/v1/booking", bookingRoutes);

// Define the port
const port = process.env.PORT || 5000; // Fallback to port 5000 if PORT is not in env

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
