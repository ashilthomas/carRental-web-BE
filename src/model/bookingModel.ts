import { Schema, model, Document, Types } from 'mongoose';

// Define an interface for the Booking document
export interface IBooking extends Document {
  vehicle: Types.ObjectId;  // Reference to Vehicle
  user: Types.ObjectId;     // Reference to User
  startDate: Date;          // Start date of the booking
  endDate: Date;            // End date of the booking
  status: string;
  currentStatus:string           // Booking status ('Booked', 'Cancelled', etc.)
}

// Define the Booking schema
const BookingSchema = new Schema<IBooking>({
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User',  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'Booked' },
 
});

// Create the Booking model using the Booking schema
const BookingModel = model<IBooking>('Booking', BookingSchema);

export default BookingModel;
