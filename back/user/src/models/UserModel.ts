import { Document, model, Schema, Types } from "mongoose";

// Definir el tipo de objeto para cada rol
interface IRole {
  type: string;
  name: string;
}

// Modificar la interfaz IUser
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  status: boolean;
  createDate: Date;
  deleteDate: Date;
  role: IRole[]; // Ahora es un arreglo de objetos con type y name
  firstName: string;
  lastName: string;
}

// Esquema de rol embebido
const roleSchema = new Schema<IRole>(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false } // Esto evita que Mongoose genere un _id para cada objeto de rol
);

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  status: { type: Boolean, default: true },
  createDate: { type: Date, default: Date.now },
  deleteDate: { type: Date },
  role: { type: [roleSchema], required: true, default: [] }, // Usar el esquema embebido
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

export const User = model<IUser>("User", userSchema, "user");
