import express from 'express';

import { AllBookedVehicle, booking } from '../controller/bookingController';

const bookingRoutes = express.Router();

// User registration route
bookingRoutes.post("/vehiclebooking", booking);
bookingRoutes.get("/allBookedvehicle", AllBookedVehicle);

export default bookingRoutes;
