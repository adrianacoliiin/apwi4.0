import { Request, response, Response } from 'express';
import { Order } from '../models/OrderModel';

/*
export const createOrder = async (req: Request, res: Response) => {
    const { idUser, status } = req.body;

    const neworder = new Order({
        idUser,
        status
    });

    const orderSaved = await neworder.save();
    return res.status(201).json({
        message: "Order created successfully", Order: orderSaved})
}
*/

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { idUser, products } = req.body;

    // Validación básica
    if (!idUser || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "idUser y al menos un producto son requeridos.",
      });
    }

    // Validación de estructura de productos
    for (const product of products) {
      if (!product.productId || !product.quantity || !product.price) {
        return res.status(400).json({
          message: "Cada producto debe tener productId, quantity y price.",
        });
      }
    }

    const newOrder = new Order({
      idUser,
      products,
    });

    const orderSaved = await newOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: orderSaved,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      message: "Error creating order",
      error,
    });
  }
};

export const updateOrder = async(req: Request,res: Response) => {
    //Pagado
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order){
        return res.status(404).json({ message: "Order not found"});
    }

    order.status="Pagado";

    const orderPaid = await order.save();
    return res.json({ orderPaid });
}

export const deleteOrder = async(req: Request,res: Response) => {
    //Cancelado
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order){
        return res.status(404).json({ message: "Order not found"});
    }

    order.status="Cancelado";

    const orderPaid = await order.save();
    return res.json({ orderPaid });
}

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      message: "Error fetching orders",
      error,
    });
  }
};