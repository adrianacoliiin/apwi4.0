import express, { Router } from "express";
import { createOrder, updateOrder, deleteOrder, getOrders } from "../controllers/auth.controller";

const router = Router();

router.post('/orders', createOrder);
router.get('/orders', getOrders);
router.put('/orders/:orderId', updateOrder);
router.delete('/orders/:orderId', deleteOrder);

export default router;