import { Document, model, Schema, Types } from "mongoose";

// Estructura del producto dentro de la orden
interface IOrderProduct {
  productId: String;
  quantity: number;
  price: number;
}

// Estructura del documento Order
export interface IOrder extends Document {
  idUser: String;
  status: string;
  products: IOrderProduct[];
  Date?: Date;
  subtotal: number;
  total: number;
}

const orderProductSchema = new Schema<IOrderProduct>(
  {
    productId: {
      type: String,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false } // No se genera un _id por cada producto
);

const orderSchema = new Schema<IOrder>({
  idUser: {
    type: String,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    default: "Pendiente",
  },
  products: {
    type: [orderProductSchema],
    required: true,
    validate: [(array: string | any) => array.length > 0, 'Debe incluir al menos un producto.'],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
  subtotal: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
});

// Middleware para calcular subtotal y total antes de guardar
orderSchema.pre("save", function (next) {
  const order = this as IOrder;

  const subtotal = order.products.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);

  order.subtotal = subtotal;
  const IVA = 0.16;
  order.total = +(subtotal * (1 + IVA)).toFixed(2); // redondea a 2 decimales

  next();
});

export const Order = model<IOrder>("Order", orderSchema, "order");
