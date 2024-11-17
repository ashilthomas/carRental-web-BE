import { Request, Response } from 'express';
import vehicleModel, { IVehicle } from '../model/vehicleModel'; // Adjust the path if necessary
import cloudinary from '../config/cloudinary';
import { AnyArray } from 'mongoose';



interface VehicleSearchQuery {
    location?: string;
    startDate?: string;
    endDate?: string;
    carType?: string;
    price?: string;
    q?:string
    sortBy?:string;
    sortOrder?:string
    page?:string
    limit? :string

 
  }




export const createVehicle = async (req: Request, res: Response): Promise<any> => {
  

    try {
     

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        const imageUrl = result.secure_url;

        const {
            carModel,
            year,
            pricePerDay,
            available,
            brand,
            type,
            description,
            details,  // Retrieve details object
            location
        } = req.body;

        const newVehicle = new vehicleModel({
            carModel,
            year,
            pricePerDay,
            available,  
            carImage: imageUrl,
            brand,
            type,
            description,
            details: {
                Transmission: details.Transmission,  
                allWheelDrive: details.allWheelDrive, 
                Passengers: details.Passengers         
            },
            location
        });

        const savedVehicle = await newVehicle.save();

        return res.status(201).json({
            message: 'Vehicle created successfully',
            vehicle: savedVehicle,
        });
    } catch (error: any) {
        console.error('Error creating vehicle:', error);
        return res.status(500).json({
            message: 'Error creating vehicle',
            error: error.message || error,
        });
    }
};

  
export const getAllVechicles =async(req:Request,res:Response)=>{
    try {
        const vechicle = await vehicleModel.find({})
        if(vechicle.length==0){
            return res.json({
                success:false,
                message:"no vechicle found"
            })
        }

        res.json({
            success:true,
            vechicle
        })
    } catch (error) {
        
    }

}




export const advSearchVechicle = async(req: Request<{}, {}, {}, VehicleSearchQuery>, res: Response)=>{
    try {
        // Extract query parameters from the request
        const { location, startDate, endDate, carType,price } = req.query;
    
        // Build the query object
        let query: any = {};
    
        // Location filter
        if (location) {
          query.location = location; // Match the car's location
        }
    
        // Date range filter (Check if vehicle is available within the given dates)
        if (startDate && endDate) {
          query.availableFrom = { $lte: new Date(startDate) }; // Vehicle available on or before start date
          query.availableTo = { $gte: new Date(endDate) };     // Vehicle available on or after end date
        }
    
        // Car type filter
        if (carType) {
          query.carType = carType; // Match the car's type (SUV, Sedan, etc.)
        }
    
        
    
        // Execute the search query
        const vehicles = await vehicleModel.find(query);
    
        // Return the filtered vehicles
        res.status(200).json(vehicles);
    
      } catch (error) {
        console.error('Error searching vehicles:', error);
        res.status(500).json({ error: 'Failed to search vehicles' });
      }
}

export const nmSearchFilter=async(req: Request<{}, {}, {}, VehicleSearchQuery>, res: Response)=>{
    try {
     
        const searchTerm = req.query.q as string || ''; 
        console.log(searchTerm);
        
        const sortBy = req.query.sortBy as string || 'latest'; // Sort by price or latest
        const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc'; // Sort order (asc or desc)
        const page = parseInt(req.query.page as string) || 1; // Page number (default to 1)
        const limit = parseInt(req.query.limit as string) || 10; // Results per page (default to 10)
    
      
        const regex = new RegExp(searchTerm, 'i'); 
        const query = {
          $or: [
            { carModel: { $regex: regex } },     // Match car name
            { brand: { $regex: regex } },  // Match car type
            { location: { $regex: regex } },  // Match car type
            { type: { $regex: regex } },  // Match car type
          ],
        };
    
   
        let sortCriteria: any = {};
        if (sortBy === 'price') {
          sortCriteria.pricePerDay = sortOrder === 'asc' ? 1 : -1; // Sort by price (asc or desc)
        } else if (sortBy === 'latest') {
          sortCriteria.createdAt = sortOrder === 'asc' ? 1 : -1; // Sort by latest (asc or desc)
        }
    
     
        const skip = (page - 1) * limit; 
    

        const vehicles = await vehicleModel.find(query)
          .sort(sortCriteria)  
          .skip(skip)          
          .limit(limit);       
    
 
        const totalVehicles = await vehicleModel.countDocuments(query);
    
        if(!totalVehicles){
      return res.json({
                success:false,
                message:"No vehicle found"
          })

        }
        res.status(200).json({
          vehicles,
          currentPage: page,
          totalPages: Math.ceil(totalVehicles / limit),
          totalVehicles,
        });
      } catch (error) {
        console.error('Error searching vehicles:', error);
        res.status(500).json({ error: 'Failed to search vehicles' });
      }

}


 // Import the vehicle model

export const toggleVehicleAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Extract vehicle ID from request parameters
        const vehicle = await vehicleModel.findById(id); // Find the vehicle by ID

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const newAvailability = !vehicle.available;

        const updatedVehicle = await vehicleModel.findByIdAndUpdate(
            id,
            { $set: { available: newAvailability } }, // Toggle availability
            { new: true, runValidators: false } // Return the updated document
        );

        return res.status(200).json({
            message: 'Vehicle availability updated successfully',
            vehicle: updatedVehicle,
        });

    } catch (error: any) {
        console.error('Error updating vehicle availability:', error);
        return res.status(500).json({
            message: 'Error updating vehicle availability',
            error: error.message || error,
        });
    }
};

export const singleVehicle = async (req: Request, res: Response) => {
  console.log("hitting");

  const { id } = req.params;
  console.log(id);

  try {
    // Use findById without an object wrapper
    const singleVehicle = await vehicleModel.findById(id);

    if (!singleVehicle) {
      return res.status(404).json({
        success: false,
        message: "No vehicle found",
      });
    }

    res.status(200).json({
      success: true,
      singleVehicle,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred",
    });
  }
};


export const deleteVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedVehicle = await vehicleModel.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({success:false, message: 'Vehicle not found' });
    }

    res.status(200).json({success:true, message: 'Vehicle successfully deleted' });
  } catch (error:any) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({success:false, message: 'An error occurred while deleting the vehicle', error: error.message });
  }
};



export const updatePrice = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    
    const { updatePrice } = req.body; // Assuming updatePrice is sent in the request body
    console.log(updatePrice);
    

    try {
        // Update the price for the document with the specified ID
        const updatedDocument = await vehicleModel.findByIdAndUpdate(
            id,
            { $set: {  pricePerDay: updatePrice } }, // Use the variable correctly here
            { new: true } // This option returns the updated document
        );
      

        // Check if the document was found and updated
        if (!updatedDocument) {
            return res.status(404).json({ message: 'Document not found.' });
        }

        // Return success response with updated document
        return res.status(200).json({ message: 'Price updated successfully.', updatedDocument });
    } catch (error) {
        console.error('Error updating price:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

