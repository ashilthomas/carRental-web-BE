import express from 'express';
import { createVehicle, deleteVehicle, getAllVechicles, nmSearchFilter, singleVehicle, toggleVehicleAvailability, updatePrice } from '../controller/VechicleController';
import upload from '../middleware/fileUploader';

const vechicleRoutes = express.Router();

// User registration route
vechicleRoutes.post("/addvechicle",upload.single("carImage"), createVehicle);
vechicleRoutes.get("/getallvechicles",getAllVechicles)
vechicleRoutes.get("/nmsearchvechicle",nmSearchFilter)
vechicleRoutes.put("/updateavilablity/:id",toggleVehicleAvailability)
vechicleRoutes.get("/singlevehicle/:id", singleVehicle);
vechicleRoutes.post("/deletevehicle/:id", deleteVehicle);
vechicleRoutes.put("/updateprice/:id", updatePrice);

export default vechicleRoutes;