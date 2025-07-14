import { Document, model, Schema, Types } from "mongoose";

export interface IROL extends Document {
  _id: Types.ObjectId,
  name: string,
  type: string,
  status: boolean
}
const rolSchema = new Schema<IROL>({
    name: { 
        type: String, 
        required: true
    },
    type: { 
        type: String, 
        required: true 
    },
    status: { 
        type: Boolean, 
        default: true 
    }
});

export const Rol = model<IROL>("Rol", rolSchema, "rol");
