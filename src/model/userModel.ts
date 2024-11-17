import { Schema, model, Document, Types } from 'mongoose';


export interface IUser extends Document {
    
    _id: Types.ObjectId; // Optionally include _id here for clarity
    username: string;
    email: string;
    password: string;
    role?: string;
    membership: boolean;

}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    membership:{ type: Boolean,  },
    role: { 
        type: String,
        enum: ["user", "admin","dealer"],
        default: "user"
    }

});

// Create and export the UserModel
const UserModel = model<IUser>('User', userSchema);
export default UserModel;
