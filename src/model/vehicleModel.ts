import { Schema, model, Document } from 'mongoose';

// Define the IVehicle interface
export interface IVehicle extends Document {
  carModel: string; // Renamed from model to carModel
  year: number;
  pricePerDay: number;
  available: string;
  carImage: string;
  brand: string;
  type: string;
  description: string;
  details: {
    Transmission: string;
    allWheelDrive: string;
    Passengers: number;
  };
  location: string;
}

// Define the VehicleSchema based on IVehicle
const VehicleSchema = new Schema<IVehicle>({
  carModel: { type: String, required: true }, // Changed from model to carModel
  year: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  available: { type: String,  
    enum: ["Available", "Maintance","UnAvailable"],
    default: "Available" },
  carImage: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  details: {
    Transmission: { type: String, required: true },
    allWheelDrive: { type: String, required: true },
    Passengers: { type: Number, required: true },
  },
  location: { type: String, required: true },
  
});

// Create the Vehicle model
const vehicleModel = model<IVehicle>('Vehicle', VehicleSchema);

export default vehicleModel;
