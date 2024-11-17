import { Types } from "mongoose";
import BookingModel, { IBooking } from "../model/bookingModel";
import { Request, Response } from "express";

interface BookingRequest extends Request {
    body: {
      vehicleId: string;
      // userId: string;
      startDate: string;
      endDate: string;
    };
  }
  

 export const booking=async(req: BookingRequest, res: Response):Promise<any>=>{
   try {
    const { vehicleId, startDate, endDate } = req.body;

    

     
      const existingBookings = await BookingModel.find({
        vehicle: vehicleId,
        $or: [
          { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
        ]
      });
  
      // If there are existing bookings, car is not available
      if (existingBookings.length > 0) {
        return res.json({ success:false, message: 'Car not available for the selected dates' });
      }
  
      // If no conflict, proceed with creating the booking
      const newBooking: IBooking = new BookingModel({
        vehicle: vehicleId,
        // user: userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'Booked'
      });
  
      // Save the booking
      await newBooking.save();
  
      // Send success response
      res.json({ success:true, message: 'Booking confirmed', booking: newBooking });
  
    
   } catch (error:any) {
    console.log(error);
    
    res.json(({
        success:false,
        message:error
    }))
    
   }
  }


  export const AllBookedVehicle = async (req: BookingRequest, res: Response): Promise<any> => {
    try {
     
      const BookedVehile = await BookingModel.find({}).populate('vehicle'); // Make sure to use 'populate'
  
      // Check if there are any booked vehicles
      if (BookedVehile.length === 0 || !BookedVehile) {
        return res.json({
          success: false,
          message: "No booked vehicle available",
        });
      }
  
      // Respond with the list of booked vehicles
      res.json({
        success: true,
        BookedVehile,
      });
  
    } catch (error: any) {
      console.log(error);
      res.json({
        success: false,
        message: error.message || "An error occurred",
      });
    }
  };
  