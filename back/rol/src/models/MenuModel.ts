import { Schema, model, Document, Types } from 'mongoose';
import '../models/RolModel'; // asegúrate de registrar el modelo de Rol

export interface IMenu extends Document {
  label: string;
  path: string;
  icon: string;
  roles: Types.ObjectId[];
}

const menuSchema = new Schema<IMenu>(
  {
    label: { type: String, required: true },
    path: { type: String, required: true },
    icon: { type: String, required: true },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Rol' }], // usar el nombre exacto del modelo Rol
  },
  { timestamps: true }
);

export const Menu = model<IMenu>('Menu', menuSchema, 'menus');