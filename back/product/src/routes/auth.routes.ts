import express, { Router } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/auth.controller";

const router = Router();

router.post('/product', createProduct);
router.get('/product', getProducts);
router.delete('/product/:id', deleteProduct);
router.put('/product/:id', updateProduct);

export default router;